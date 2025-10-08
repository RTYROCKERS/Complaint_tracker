// backend/cron/overdueChecker.js
import pool from "../db.js";
import { sendEmail } from "../utils/emailService.js";
import cron from "node-cron";

const checkOverduePosts = async () => {
  try {
    const now = new Date();
    const query = `
      SELECT p.*, u.email, u.name AS official_name
      FROM posts p
      JOIN users u ON p.assigned_official = u.u_id
      WHERE p.due_date < $1 AND p.status != 'RESOLVED'
    `;
    const { rows } = await pool.query(query, [now]);

    for (const post of rows) {
      const subject = "Overdue Complaint Reminder";
      const text = `Hello ${post.official_name},

The complaint titled "${post.title}" is overdue.
Please resolve it as soon as possible.

- Complaint Tracker System`;

      await sendEmail(post.email, subject, text);
    }

    if (rows.length > 0) console.log(`📧 Sent ${rows.length} overdue reminders.`);
  } catch (err) {
    console.error("❌ Overdue check failed:", err.message);
  }
};

// Runs daily at 9 AM
cron.schedule("0 9 * * *", checkOverduePosts);
