// post_updateController.js
import pool from "../db.js";
import { notifyOnPostStatusChange } from "../services/notificationService.js";

/**
 * Add resolvement (official update). Notify the post owner about the update/status.
 */
export const addResolvement = async (req, res) => {
  const { official_id, post_id, update_text, status } = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      `INSERT INTO post_resolvements (official_id, post_id, update_text, status, photoUrl)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [official_id, post_id, update_text, status, photoUrl]
    );

    const resolvement = result.rows[0];

    // If this resolvement sets/changes post status, update post.status optionally.
    // Decide if adding a resolvement should auto-update the post status.
    // If you want that behavior uncomment below (and adjust logic):
    // await pool.query('UPDATE posts SET status = $1 WHERE post_id = $2', [status, post_id]);

    // Notify post owner about this resolvement and any status change
    try {
      // fetch current post status to compute old vs new (optional)
      const postRes = await pool.query('SELECT status FROM posts WHERE post_id = $1', [post_id]);
      const post = postRes.rows[0] || {};
      const oldStatus = post.status ?? "UNKNOWN";
      const newStatus = status ?? oldStatus;

      // If status changed, call notifyOnPostStatusChange with old/new
      if (status && status !== oldStatus) {
        // update posts table status so DB reflects change
        await pool.query('UPDATE posts SET status = $1 WHERE post_id = $2', [status, post_id]);
        await notifyOnPostStatusChange(post_id, oldStatus, status);
      } else {
        // No status change, still notify user that there's a resolvement update
        // We'll call notifyOnPostStatusChange with identical statuses so message still sent:
        await notifyOnPostStatusChange(post_id, oldStatus, newStatus);
      }
    } catch (notifyErr) {
      console.error("Notification error (addResolvement):", notifyErr);
      // do not fail request because of notification error
    }

    res.json({ message: "Resolvement update submitted", resolvement_update: resolvement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Resolvement update failed to submit" });
  }
};

export const addResolvementReply = async (req, res) => {
  const { resolvement_id, user_id, content } = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const result = await pool.query(
      `INSERT INTO resolvement_replies (resolvement_id, user_id, content, photoUrl)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [resolvement_id, user_id, content, photoUrl]
    );

    res.json({ message: "Resolvement reply submitted", resolvement_reply: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit resolvement reply" });
  }
};
