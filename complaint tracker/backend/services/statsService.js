import pool from "../db.js"; // adjust path if different

export async function fetchComplaintStats() {
  const [total, byStatus] = await Promise.all([
    pool.query("SELECT COUNT(*)::int AS total FROM posts"),
    pool.query("SELECT status, COUNT(*)::int AS count FROM posts GROUP BY status")
  ]);

  return {
    total: total.rows[0].total,
    byStatus: byStatus.rows
  };
}