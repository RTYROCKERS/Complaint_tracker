import express from "express";
import { signup, login } from "../controllers/login_signupController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;