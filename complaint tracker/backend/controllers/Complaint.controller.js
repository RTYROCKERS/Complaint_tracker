import pool from "../db.js";

export const getComplaints = async (req, res) => {
  const { group_id, status, startDate, endDate } = req.query;

  let query = `
    SELECT p.*, g.name as group_name, g.area as group_area
    FROM posts p
    LEFT JOIN groups g ON p.group_id = g.group_id
    WHERE 1=1
  `;
  const values = [];
  let idx = 1;

  if (group_id) {
    query += ` AND p.group_id = $${idx++}`;
    values.push(group_id);
  }

  if (status) {
    query += ` AND p.status = $${idx++}`;
    values.push(status);
  }

  if (startDate) {
    query += ` AND p.created_at >= $${idx++}`;
    values.push(startDate);
  }

  if (endDate) {
    query += ` AND p.created_at <= $${idx++}`;
    values.push(endDate);
  }

  query += " ORDER BY p.created_at DESC";

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};
