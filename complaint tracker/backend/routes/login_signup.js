import express from "express";
import pool from "../db.js";
import { signup, login } from "../controllers/login_signupController.js";
import { authenticate } from "../Middlewares/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", authenticate, (req, res) => {
  // If authenticate passes, token is valid
  res.json({ valid: true, user: req.user });
});
router.post("/type", async(req,res)=>{
  const {user_id}=req.body;
  try{
    const result = await pool.query("SELECT name,role FROM users WHERE u_id = $1", [user_id]);
    res.json({ message: "Signup successful", data:result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Role fetching failed" });
  }
}

);

export default router;