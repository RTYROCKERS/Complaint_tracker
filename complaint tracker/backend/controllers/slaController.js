import db from '../db.js';
import { sendEmail } from '../services/emailService.js';

const DEFAULT_THRESHOLD_HOURS = process.env.SLA_THRESHOLD_HOURS
  ? Number(process.env.SLA_THRESHOLD_HOURS)
  : 72;

export async function getSlaStats(req, res) {
  try {
    const threshold = Number(req.query.threshold_hours) || DEFAULT_THRESHOLD_HOURS;

    const queryText = `
      WITH params AS (
          SELECT CAST($1 AS DOUBLE PRECISION) AS threshold
      ),
      open_posts AS (
          SELECT
              p.post_id,
              p.title,
              p.description,
              p.status,
              p.created_at,
              p.photoUrl,
              p.latitude,
              p.longitude,
              p.type,
              p.days_required,
              u.u_id AS author_id,
              u.name AS author_name,
              u.email AS author_email,
              p.overdue_notified,
              EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600.0 AS hours_open
          FROM posts p
          LEFT JOIN users u ON p.user_id = u.u_id
          WHERE p.status NOT IN ('RESOLVED','CANCELLED')
      )
      SELECT * FROM open_posts;
    `;

    const { rows } = await db.query(queryText, [threshold]);

    // Send email for new overdue posts only
    for (let post of rows) {
      const isOverdue = post.hours_open > threshold;
      if (isOverdue && !post.overdue_notified && post.author_email) {
        // Send email
        await sendEmail(
          post.author_email,
          `⚠️ Your post is overdue!`,
          `Hello, your post titled "${post.title}" has exceeded the SLA threshold. Please take action.`
        );

        // Mark as notified
        await db.query(
          `UPDATE posts SET overdue_notified = TRUE WHERE post_id = $1`,
          [post.post_id]
        );

        console.log(`✅ Email sent to ${post.author_email} for overdue post ID ${post.post_id}`);
      }
    }

    // Prepare payload
    const payload = {
      threshold_hours: threshold,
      total_open: rows.length,
      overdue_count: rows.filter(p => p.hours_open > threshold).length,
      posts: rows.map(p => ({
        post_id: p.post_id,
        title: p.title,
        description: p.description,
        status: p.status,
        hours_open: Math.round(p.hours_open * 100) / 100,
        overdue: p.hours_open > threshold,
        created_at: p.created_at,
        photoUrl: p.photoUrl,
        latitude: p.latitude,
        longitude: p.longitude,
        type: p.type,
        days_required: p.days_required,
        author: {
          user_id: p.author_id,
          name: p.author_name
        }
      }))
    };

    res.json(payload);
  } catch (err) {
    console.error('getSlaStats error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
