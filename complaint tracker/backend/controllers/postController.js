import pool from "../db.js";

export const createGroup = async(req,res) => {
    const {name,level,city,user_id} =req.body;
    try{
        const result = await pool.query(
            `INSERT INTO groups(name,level,city,created_by)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [name,level,city,user_id]
        );

        res.json({ message: "Group created", complaint: result.rows[0] });
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Failed to create group" });
    }

};

export const createComplaint = async (req, res) => {
  const { user_id, group_id, title, description, status} = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      `INSERT INTO posts (user_id, group_id, title, description, status, photoUrl)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, group_id, title, description, status, photoUrl]
    );

    res.json({ message: "Complaint submitted", complaint: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit complaint" });
  }
};


export const addReply = async(req,res)=>{
    const {post_id,user_id,content}=req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const result = await pool.query(
        `INSERT INTO post_replies (post_id,user_id,content,photoUrl)
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [post_id,user_id,content,photoUrl]
        );

        res.json({ message: "Complaint reply submitted", complaint_reply: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit complaint_reply" });
    }

};