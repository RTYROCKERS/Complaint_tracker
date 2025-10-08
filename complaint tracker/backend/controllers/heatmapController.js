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

    const query = `
      SELECT p.latitude, p.longitude, p.type, p.days_required
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
    const result = await pool.query(`
      SELECT city, locality
      FROM groups
      WHERE city IS NOT NULL
      ORDER BY city, locality
    `);

    // Group by city for easier frontend dropdown
    const cityLocalities = {};
    result.rows.forEach(r => {
      if (!cityLocalities[r.city]) cityLocalities[r.city] = [];
      cityLocalities[r.city].push(r.locality);
    });

    res.json(cityLocalities);
  } catch (err) {
    console.error("Error fetching city-locality combinations:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
