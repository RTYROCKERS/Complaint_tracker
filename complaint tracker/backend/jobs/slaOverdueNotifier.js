// slaOverdueNotifier.js
import cron from "node-cron";
import dotenv from "dotenv";
import pool from "../db.js";
import { notifyOnSlaOverdue } from "../services/notificationService.js";
dotenv.config();

const schedule = process.env.CRON_OVERDUE_SCHEDULE || "0 9 * * *"; // default 9:00 daily

cron.schedule(schedule, async () => {
  console.log("[SLA job] running overdue check...");
  try {
    const q = `
      SELECT * FROM posts
      WHERE sla_due_date IS NOT NULL
        AND sla_due_date < NOW()
        AND status NOT IN ('RESOLVED','CANCELLED')
        AND (notified_overdue IS DISTINCT FROM TRUE)
    `;
    const res = await pool.query(q);
    for (const post of res.rows) {
      try {
        await notifyOnSlaOverdue(post);
        await pool.query("UPDATE posts SET notified_overdue = TRUE WHERE post_id = $1", [post.post_id]);
      } catch (err) {
        console.error("[SLA job] notify failed for post:", post.post_id, err);
        // leave notified_overdue = FALSE so job will retry next run
      }
    }
    console.log(`[SLA job] done, processed ${res.rows.length} posts`);
  } catch (err) {
    console.error("[SLA job] failed:", err);
  }
});
