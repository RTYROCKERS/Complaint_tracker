import pool from "../db.js";

export const addResolvement = async (req, res) => {
  const { official_id, post_id, update_text} = req.body;
  let photoUrl = null;
  try {
    if (req.file && req.file.buffer) {
      // Upload buffer to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "complaint_tracker_uploads" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      photoUrl = uploadResult.secure_url; // Cloudinary URL
    }
    
  const result = await pool.query(
    `INSERT INTO post_resolvements (official_id, post_id, update_text, photoUrl)
      VALUES ($1, $2, $3, $4) RETURNING *`,
    [official_id, post_id, update_text, photoUrl]
  );

  res.json({ message: "Resolvement update submitted", resolvement_update: result.rows[0] });
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: "Resolvement update failed to submit" });
  }
};
export const getResolvements = async (req,res) => {
  const {post_id} = req.body; 
  try {
    const result = await pool.query(
    `SELECT 
      pr.update_text, 
      pr.photoUrl, 
      pr.created_at, 
      pr.official_id, 
      u.name AS official_name
    FROM post_resolvements pr
    INNER JOIN users u ON pr.official_id = u.u_id
    WHERE pr.post_id = $1
    ORDER BY pr.created_at DESC;
      `,
      [post_id]
    );

    res.json({ message: "Resolvement update received", updates: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Resolvement updates failed to get" });
  }
};