import pool from "../db.js";
import { io } from "../index.js";
export const createGroup = async(req,res) => {
    const {name,locality,city,user_id} =req.body;
    try{
        const result = await pool.query(
            `INSERT INTO groups(name,locality,city,created_by)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [name,locality,city,user_id]
        );

        res.json({ message: "Group created", complaint: result.rows[0] });
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Failed to create group" });
    }

};
export const getPosts = async(req,res) => {
    const {group_id}=req.body;
    try{
      const query = `
        SELECT *
        FROM posts
        WHERE group_id = $1
        ORDER BY created_at DESC
      `;

      const result = await pool.query(query,[group_id]);
      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching posts:", err.message);
      res.status(500).json({ error: "Server error" });
    }
};
export const getGroups = async (req, res) => {
  try {
    const { city, locality } = req.query;

    const values = [];
    const conditions = [];

    if (city) {
      values.push(city);
      conditions.push(`LOWER(g.city) = LOWER($${values.length})`);
    }
    if (locality) {
      values.push(locality);
      conditions.push(
        `LOWER(g.locality) = LOWER($${values.length})`
      );
    }

    let query = `
      SELECT g.group_id, g.name, g.created_by, u.name AS created_by_name, g.created_at
      FROM groups g
      JOIN users u ON g.created_by = u.u_id
    `;

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " ORDER BY g.created_at DESC";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching groups:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const createComplaint = async (req, res) => {
  const { user_id, group_id, title, description, status, latitude, longitude, type, days_required} = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      `INSERT INTO posts (user_id, group_id, title, description, status, photoUrl, latitude, longitude, type, days_required)
      VALUES ($1, $2, $3, $4, $5, $6,$7,$8,$9,$10) RETURNING *`,
      [user_id, group_id, title, description, status, photoUrl, latitude, longitude, type, days_required]
    );
    const newPost = result.rows[0];

    // Emit to group room
    io.to(`group_${group_id}`).emit("postAdded", newPost);

    // Emit globally for LiveStats page
    io.emit("globalPostAdded", newPost);
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
        const result2 = await pool.query(
          `SELECT name FROM USERS
          WHERE u_id=$1
          `,[user_id]
        );
        const newReply={reply_id: result.rows[0].reply_id, 
          content: result.rows[0].content,
          created_at: result.rows[0].created_at,
          name: result2.rows[0].name
        };
        io.to(`post_${post_id}`).emit("replyAdded", newReply);
        res.json({ message: "Complaint reply submitted", complaint_reply: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit complaint_reply" });
    }

};
export const getReply = async(req,res) => {
    const {post_id}=req.body;
    try{
      const query = `
        SELECT p.reply_id, p.content, p.created_at, u.name
        FROM post_replies p
        JOIN users u ON u.u_id = p.user_id
        WHERE p.post_id = $1
        ORDER BY p.created_at DESC
      `;

      const result = await pool.query(query,[post_id]);
      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching posts:", err.message);
      res.status(500).json({ error: "Server error" });
    }
};
export const assignment = async(req,res) => {
  const { post_id, officialId } = req.body;
  try{
    await pool.query(
      "UPDATE posts SET Assigned_Official = $1 WHERE post_id = $2",
      [officialId, post_id]
    );
    res.json({ message: "Official assigned successfully" });
    }catch (err) {
      console.error("Error assigning: ", err.message);
      res.status(500).json({ error: "Server error" });
  }
};
export const assignmentRemoval = async(req,res) => {
  const { post_id } = req.body;
  try{
    await pool.query(
      "UPDATE posts SET Assigned_Official = NULL WHERE post_id = $1",
      [post_id]
    );
    res.json({ message: "Official removed successfully" });
    }catch (err) {
      console.error("Error removal: ", err.message);
      res.status(500).json({ error: "Server error" });
  }  
};
export const getOfficials = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT u_id, name, address FROM users WHERE role = 'official'"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching officials:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
export const deletePost = async (req, res) => {
  const { post_id } = req.body;
  try {
    // Delete from dependent tables first
    await pool.query("DELETE FROM post_replies WHERE post_id = $1", [post_id]);
    await pool.query("DELETE FROM post_resolvements WHERE post_id = $1", [post_id]);
    await pool.query("DELETE FROM posts WHERE post_id = $1", [post_id]);
    res.status(200).json({ message: "Post and related data deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
};