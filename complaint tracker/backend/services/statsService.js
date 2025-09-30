import pool from "../db.js"; // adjust path if different

export async function fetchComplaintStats() {
  const [total, byStatus, byGroup, bySeverity] = await Promise.all([
    pool.query("SELECT COUNT(*)::int AS total FROM posts"),
    pool.query("SELECT status, COUNT(*)::int FROM posts GROUP BY status"),
    pool.query(`
      SELECT g.name, COUNT(p.post_id)::int AS count
      FROM posts p
      JOIN groups g ON p.group_id = g.group_id
      GROUP BY g.name
    `),
    pool.query("SELECT severity, COUNT(*)::int FROM posts GROUP BY severity")
  ]);

  return {
    total: total.rows[0].total,
    byStatus: byStatus.rows,
    byGroup: byGroup.rows,
    bySeverity: bySeverity.rows
  };
}
