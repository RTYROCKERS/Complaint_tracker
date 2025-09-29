import express from "express";
import { signup, login } from "../controllers/login_signupController.js";
import { authenticate } from "../Middlewares/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/auth/verify", authenticate, (req, res) => {
  // If authenticate passes, token is valid
  res.json({ valid: true, user: req.user });
});

export default router;