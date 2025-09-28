import pool from "../db.js";

export const addResolvement = async (req, res) => {
  const { official_id, post_id, update_text, status} = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      `INSERT INTO post_resolvements (official_id, post_id, update_text, status, photoUrl)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [official_id, post_id, update_text, status, photoUrl]
    );

    res.json({ message: "Resolvement update submitted", resolvement_update: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Resolvement update failed to submit" });
  }
};


export const addResolvementReply = async(req,res)=>{
    const {resolvement_id,user_id,content}=req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const result = await pool.query(
        `INSERT INTO resolvement_replies (resolvement_id,user_id,content,photoUrl)
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [resolvement_id,user_id,content,photoUrl]
        );

        res.json({ message: "Resolvement reply submitted", resolvement_reply: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit reolvement reply" });
    }

};
