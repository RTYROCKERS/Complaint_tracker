// backend/triggers/emailNotifier.js
import pool from "../db.js";
import { sendEmail } from "../utils/emailService.js";
import cron from "node-cron";

let lastSeenResolvementId = 0;

async function initLastSeenId() {
  try {
    const { rows } = await pool.query("SELECT MAX(resolvement_id) AS max_id FROM post_resolvements");
    lastSeenResolvementId = rows[0].max_id || 0;
    console.log(`emailNotifier: initialized lastSeenResolvementId = ${lastSeenResolvementId}`);
  } catch (err) {
    console.error("emailNotifier: failed to initialize lastSeenResolvementId:", err.message);
  }
}

async function fetchNewResolvements(sinceId) {
  const query = `
    SELECT
      r.resolvement_id,
      r.post_id,
      r.official_id,
      r.update_text,
      r.created_at,
      p.title AS post_title,
      p.user_id AS post_user_id,
      pu.email AS post_user_email,
      pu.name AS post_user_name,
      off.o_id AS official_o_id,
      off.user_id AS official_user_id,
      ou.email AS official_email,
      ou.name AS official_name
    FROM post_resolvements r
    JOIN posts p ON r.post_id = p.post_id
    JOIN users pu ON p.user_id = pu.u_id
    LEFT JOIN officials off ON r.official_id = off.o_id
    LEFT JOIN users ou ON off.user_id = ou.u_id
    WHERE r.resolvement_id > $1
    ORDER BY r.resolvement_id ASC
  `;

  const { rows } = await pool.query(query, [sinceId]);
  return rows;
}

async function processNewResolvements() {
  try {
    const rows = await fetchNewResolvements(lastSeenResolvementId);
    if (!rows.length) {
      // nothing new
      return;
    }

    for (const row of rows) {
      try {
        // Email to post owner (the citizen who created the post)
        if (row.post_user_email) {
          const subject = `Update on your complaint: "${row.post_title}"`;
          const text = `Hello ${row.post_user_name || "User"},\n\n` +
            `There is a new update from an official on your complaint titled "${row.post_title}".\n\n` +
            `Update: ${row.update_text || "(no text provided)"}\n\n` +
            `Status updated at: ${row.created_at}\n\n` +
            `Thank you,\nComplaint Tracker Team`;

          await sendEmail(row.post_user_email, subject, text);
        }

        // Optional: Email to the official who posted the resolvement (confirmation)
        if (row.official_email) {
          const subject = `Your update posted for complaint: "${row.post_title}"`;
          const text = `Hello ${row.official_name || "Official"},\n\n` +
            `Your update for the complaint titled "${row.post_title}" has been recorded.\n\n` +
            `Update: ${row.update_text || "(no text provided)"}\n\n` +
            `Posted at: ${row.created_at}\n\n` +
            `Thank you,\nComplaint Tracker System`;

          await sendEmail(row.official_email, subject, text);
        }
      } catch (err) {
        console.error(`emailNotifier: failed to send email for resolvement ${row.resolvement_id}:`, err.message);
      }

      // after processing each, advance lastSeenResolvementId
      lastSeenResolvementId = Math.max(lastSeenResolvementId, row.resolvement_id);
    }

    console.log(`emailNotifier: processed ${rows.length} new resolvement(s). lastSeen=${lastSeenResolvementId}`);
  } catch (err) {
    console.error("emailNotifier: error in processNewResolvements:", err.message);
  }
}

// Initialize and schedule
(async () => {
  await initLastSeenId();
  // Run immediately once to catch anything created after init
  await processNewResolvements();

  // Then run every minute (adjust cron if you prefer a different frequency)
  cron.schedule("* * * * *", processNewResolvements);
})();
