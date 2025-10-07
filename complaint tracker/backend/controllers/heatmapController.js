// backend/controllers/heatmapController.js
import pool from "../db.js";

export const getHeatmapPosts = async (req, res) => {
  try {
    const { city, locality } = req.query; // city and/or locality

    const values = [];
    let conditions = ["p.latitude IS NOT NULL", "p.longitude IS NOT NULL"];

    if (city) {
      values.push(city);
      conditions.push(`LOWER(g.city) = LOWER($${values.length})`);
    }

    if (locality) {
      values.push(locality);
      conditions.push(`LOWER(g.locality) = LOWER($${values.length})`);
    }

    // select days_required (your renamed severity column), cast latitude/longitude to float
    const query = `
      SELECT
        p.post_id,
        p.latitude::float AS latitude,
        p.longitude::float AS longitude,
        p.type,
        p.days_required
      FROM posts p
      JOIN groups g ON p.group_id = g.group_id
      WHERE ${conditions.join(" AND ")}
    `;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching heatmap posts:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCityLocalities = async (req, res) => {
  try {
    // get distinct non-null city/locality pairs
    const result = await pool.query(`
      SELECT DISTINCT city, locality
      FROM groups
      WHERE city IS NOT NULL AND locality IS NOT NULL
      ORDER BY city, locality
    `);

    // Group by city for easier frontend dropdown
    const cityLocalities = {};
    result.rows.forEach(r => {
      if (!cityLocalities[r.city]) cityLocalities[r.city] = [];
      // avoid duplicate localities
      if (!cityLocalities[r.city].includes(r.locality)) {
        cityLocalities[r.city].push(r.locality);
      }
    });

    res.json(cityLocalities);
  } catch (err) {
    console.error("Error fetching city-locality combinations:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
