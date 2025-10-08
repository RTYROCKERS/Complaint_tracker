// backend/triggers/statusChangeWatcher.js
import pool from "../db.js";
import { sendEmail } from "../utils/emailService.js";
import cron from "node-cron";

let lastKnownStatuses = new Map();

const fetchStatuses = async () => {
  const { rows } = await pool.query(`
    SELECT post_id, title, status, user_id
    FROM posts
  `);
  return rows;
};

const checkStatusChanges = async () => {
  try {
    const current = await fetchStatuses();

    for (const post of current) {
      const prevStatus = lastKnownStatuses.get(post.post_id);

      if (prevStatus && prevStatus !== post.status) {
        const userRes = await pool.query("SELECT name, email FROM users WHERE u_id = $1", [post.user_id]);
        if (userRes.rows.length === 0) continue;

        const { name, email } = userRes.rows[0];
        const subject = "Complaint Status Update";
        const text = `Hello ${name},

The status of your complaint titled "${post.title}" has been updated to "${post.status}".

Thank you,
Complaint Tracker Team`;

        await sendEmail(email, subject, text);
      }

      lastKnownStatuses.set(post.post_id, post.status);
    }

    console.log("🔄 Status change check completed.");
  } catch (err) {
    console.error("❌ Status change watcher failed:", err.message);
  }
};

// Initial load
(async () => {
  const posts = await fetchStatuses();
  posts.forEach(p => lastKnownStatuses.set(p.post_id, p.status));
})();

// Check every minute
cron.schedule("* * * * *", checkStatusChanges);
