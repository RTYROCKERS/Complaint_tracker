const pool = require("../db.js");

// Controller to get posts for heatmap
export const  getHeatmapPosts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT latitude, longitude 
      FROM posts
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching heatmap posts:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};


