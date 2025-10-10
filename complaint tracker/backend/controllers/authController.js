// backend/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import pool from "../db.js";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ""; // set in .env
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

export const signup = async (req, res) => {
  const { name, address, aadhar_no, email, password, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, address, aadhar_no, email, password_hash, role) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, address, aadhar_no, email || null, hashed, role]
    );

    const user = result.rows[0];

    // Insert into role-specific table
    if (role === "citizen") {
      await pool.query(`INSERT INTO citizens (user_id) VALUES ($1)`, [user.u_id]);
    } else if (role === "moderator") {
      await pool.query(`INSERT INTO moderators (user_id, groups_moderated) VALUES ($1, '{}')`, [user.u_id]);
    } else if (role === "official") {
      await pool.query(
        `INSERT INTO officials (user_id, groups, political_party) VALUES ($1, '[]', $2)`,
        [user.u_id, req.body.political_party || null]
      );
    }

    res.json({ message: "Signup successful", user });
  } catch (err) {
    console.error(err);
    // if duplicate key on unique columns, send meaningful message
    if (err.code === "23505") {
      return res.status(400).json({ error: "Duplicate entry (aadhar_no or email already exists)" });
    }
    res.status(500).json({ error: "Signup failed" });
  }
};

export const login = async (req, res) => {
  const { aadhar_no, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE aadhar_no = $1", [aadhar_no]);
    if (result.rows.length === 0) return res.status(400).json({ error: "User not found" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ u_id: user.u_id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

export const googleLogin = async (req, res) => {
  const { id_token } = req.body;
  if (!id_token) return res.status(400).json({ error: "Missing id_token" });

  if (!googleClient) {
    console.error("GOOGLE_CLIENT_ID not set in environment");
    return res.status(500).json({ error: "Google login not configured on server" });
  }

  try {
    // Verify token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const email_verified = payload?.email_verified;

    if (!email || !email_verified) {
      return res.status(401).json({ error: "Email not verified by Google" });
    }

    // Check if user exists in DB
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rowCount === 0) {
      // Email not in DB → login fails
      return res.status(401).json({ error: "Google Authentication failed: user not found" });
    }

    const user = result.rows[0];
    const token = jwt.sign(
      { u_id: user.u_id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return JWT + minimal user info
    res.json({
      message: "Login successful",
      token,
      role: user.role,
      user: { u_id: user.u_id, email: user.email, name: user.name }
    });
  } catch (err) {
    console.error("Google token verify error:", err);
    return res.status(401).json({ error: "Invalid Google token" });
  }
};
