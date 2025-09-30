import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const SECRET_KEY = "supersecretkey"; // env var in production

export const signup = async (req, res) => {
  const { name, address, aadhar_no, password, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, address, aadhar_no, password_hash, role) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, address, aadhar_no, hashed, role]
    );

    const user = result.rows[0];

    // Insert into role-specific table
    if (role === "citizen") {
      await pool.query(`INSERT INTO citizens (user_id) VALUES ($1)`, [user.u_id]);
    } else if (role === "moderator") {
      await pool.query(`INSERT INTO moderators (user_id, groups_moderated) VALUES ($1, '{}')`, [user.u_id]);
    } else if (role === "official") {
      await pool.query(`INSERT INTO officials (user_id, groups, political_party) VALUES ($1, '[]', $2)`, [
        user.u_id,
        req.body.political_party || null,
      ]);
    }

    res.json({ message: "Signup successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
};
export const login =  async (req, res) => {
  const { aadhar_no, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE aadhar_no = $1", [aadhar_no]);
    if (result.rows.length === 0) return res.status(400).json({ error: "User not found" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ u_id: user.u_id, role: user.role }, SECRET_KEY, { expiresIn: "1d" });

    res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};
