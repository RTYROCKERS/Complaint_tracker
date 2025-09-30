// backend/controllers/slaController.js
import db from '../db.js';

const DEFAULT_THRESHOLD_HOURS = process.env.SLA_THRESHOLD_HOURS
  ? Number(process.env.SLA_THRESHOLD_HOURS)
  : 72;

export async function getSlaStats(req, res) {
  try {
    const threshold = Number(req.query.threshold_hours) || DEFAULT_THRESHOLD_HOURS;

    const queryText = `
      WITH open_posts AS (
        SELECT
          p.post_id,
          p.title,
          p.description,
          p.status,
          p.created_at,
          p."photoUrl",   -- correct casing for column name
          p.latitude,
          p.longitude,
          p.type,
          p.severity,
          u.u_id AS author_id,
          u.name AS author_name,
          EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600.0 AS hours_open
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.u_id
        WHERE p.status NOT IN ('RESOLVED','CANCELLED')
      )
      SELECT
        json_build_object(
          'threshold_hours', $1,
          'total_open', (SELECT COUNT(*) FROM open_posts),
          'overdue_count', (SELECT COUNT(*) FROM open_posts WHERE hours_open > $1),
          'posts', (SELECT COALESCE(json_agg(
                       json_build_object(
                         'post_id', post_id,
                         'title', title,
                         'description', description,
                         'status', status,
                         'hours_open', ROUND(hours_open::numeric, 2),
                         'overdue', (hours_open > $1),
                         'created_at', created_at,
                         'photoUrl', "photoUrl",
                         'latitude', latitude,
                         'longitude', longitude,
                         'type', type,
                         'severity', severity,
                         'author', json_build_object(
                           'user_id', author_id,
                           'name', author_name
                         )
                       ) ORDER BY hours_open DESC
                     ), '[]'::json)
                 FROM open_posts)
        ) AS result;
    `;

    const { rows } = await db.query(queryText, [threshold]);
    const payload = rows[0] ? rows[0].result : {
      threshold_hours: threshold,
      total_open: 0,
      overdue_count: 0,
      posts: []
    };

    res.json(payload);
  } catch (err) {
    console.error('getSlaStats error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
