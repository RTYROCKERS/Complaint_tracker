// backend/controllers/postController.js
import dotenv from "dotenv";
dotenv.config();
import pool from "../db.js";
<<<<<<< Updated upstream

export const createGroup = async(req,res) => {
    const {name,level,city,user_id} =req.body;
    try{
        const result = await pool.query(
            `INSERT INTO groups(name,level,city,created_by)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [name,level,city,user_id]
        );
=======
import { io } from "../index.js";
import { v2 as cloudinary } from "cloudinary";
>>>>>>> Stashed changes

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

console.log(
  "Cloudinary config loaded:",
  process.env.CLOUDINARY_CLOUD_NAME,
  process.env.CLOUDINARY_API_KEY,
  process.env.CLOUDINARY_API_SECRET
);

// ---------------- Create Group ----------------
export const createGroup = async (req, res) => {
  const { name, locality, city, user_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO groups(name, locality, city, created_by)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, locality, city, user_id]
    );

    res.json({ message: "Group created", complaint: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create group" });
  }
};
<<<<<<< Updated upstream
=======

// ---------------- Get Posts ----------------
export const getPosts = async (req, res) => {
  const { group_id } = req.body;
  try {
    const query = `
      SELECT *
      FROM posts
      WHERE group_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [group_id]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Get Groups ----------------
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
      conditions.push(`LOWER(g.locality) = LOWER($${values.length})`);
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
>>>>>>> Stashed changes

// ---------------- Create Complaint ----------------
export const createComplaint = async (req, res) => {
<<<<<<< Updated upstream
  const { user_id, group_id, title, description, status} = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
=======
  const {
    user_id,
    group_id,
    title,
    description,
    status,
    latitude,
    longitude,
    type,
    days_required,
  } = req.body;
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
      `INSERT INTO posts (user_id, group_id, title, description, status, photoUrl)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, group_id, title, description, status, photoUrl]
    );

    res.json({ message: "Complaint submitted", complaint: result.rows[0] });
=======
      `INSERT INTO posts 
        (user_id, group_id, title, description, status, photoUrl, latitude, longitude, type, days_required)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        user_id,
        group_id,
        title,
        description,
        status,
        photoUrl,
        latitude,
        longitude,
        type,
        days_required,
      ]
    );

    const newPost = result.rows[0];

    io.to(`group_${group_id}`).emit("postAdded", newPost);
    io.emit("globalPostAdded", newPost);

    res.json({ message: "Complaint submitted", complaint: newPost });
>>>>>>> Stashed changes
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit complaint" });
  }
};

// ---------------- Add Reply ----------------
export const addReply = async (req, res) => {
  const { post_id, user_id, content } = req.body;
  let photoUrl = null;

  try {
    if (req.file) {
      photoUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "complaint_tracker_uploads" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
<<<<<<< Updated upstream

        res.json({ message: "Complaint reply submitted", complaint_reply: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit complaint_reply" });
    }

};
=======
        stream.end(req.file.buffer);
      });

      photoUrl = `/posts/image-proxy?url=${encodeURIComponent(photoUrl)}`;
    }

    const result = await pool.query(
      `INSERT INTO post_replies (post_id, user_id, content, photoUrl)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [post_id, user_id, content, photoUrl]
    );

    const result2 = await pool.query(`SELECT name FROM users WHERE u_id = $1`, [user_id]);

    const newReply = {
      reply_id: result.rows[0].reply_id,
      content: result.rows[0].content,
      created_at: result.rows[0].created_at,
      name: result2.rows[0].name,
    };

    io.to(`post_${post_id}`).emit("replyAdded", newReply);

    res.json({ message: "Complaint reply submitted", complaint_reply: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit complaint_reply" });
  }
};

// ---------------- Get Replies ----------------
export const getReply = async (req, res) => {
  const { post_id } = req.body;
  try {
    const query = `
      SELECT p.reply_id, p.content, p.created_at, u.name
      FROM post_replies p
      JOIN users u ON u.u_id = p.user_id
      WHERE p.post_id = $1
      ORDER BY p.created_at DESC
    `;
    const result = await pool.query(query, [post_id]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Assign Official ----------------
export const assignment = async (req, res) => {
  const { post_id, officialId } = req.body;
  try {
    await pool.query("UPDATE posts SET assigned_official = $1 WHERE post_id = $2", [
      officialId,
      post_id,
    ]);
    res.json({ message: "Official assigned successfully" });
  } catch (err) {
    console.error("Error assigning: ", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Remove Official ----------------
export const assignmentRemoval = async (req, res) => {
  const { post_id } = req.body;
  try {
    await pool.query("UPDATE posts SET assigned_official = NULL WHERE post_id = $1", [post_id]);
    res.json({ message: "Official removed successfully" });
  } catch (err) {
    console.error("Error removal: ", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Get Officials ----------------
export const getOfficials = async (req, res) => {
  try {
    const result = await pool.query("SELECT u_id, name, address FROM users WHERE role = 'official'");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching officials:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Delete Post ----------------
export const deletePost = async (req, res) => {
  const { post_id } = req.body;
  try {
    await pool.query("DELETE FROM post_replies WHERE post_id = $1", [post_id]);
    await pool.query("DELETE FROM post_resolvements WHERE post_id = $1", [post_id]);
    await pool.query("DELETE FROM posts WHERE post_id = $1", [post_id]);
    res.status(200).json({ message: "Post and related data deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
};
>>>>>>> Stashed changes
