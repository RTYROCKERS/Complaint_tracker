import pool from "../db.js";

export const getComplaints = async (req, res) => {
  const { type, area, urgency, startDate, endDate } = req.query;

  // Build dynamic SQL query
  let query = "SELECT * FROM complaints WHERE 1=1";
  const values = [];
  let idx = 1;

  if (type) {
    query += ` AND type = $${idx++}`;
    values.push(type);
  }
  if (area) {
    query += ` AND area = $${idx++}`;
    values.push(area);
  }
  if (urgency) {
    query += ` AND urgency = $${idx++}`;
    values.push(urgency);
  }
  if (startDate) {
    query += ` AND created_at >= $${idx++}`;
    values.push(startDate);
  }
  if (endDate) {
    query += ` AND created_at <= $${idx++}`;
    values.push(endDate);
  }

  query += " ORDER BY created_at DESC"; // latest first

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
};
