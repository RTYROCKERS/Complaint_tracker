import express from "express";
import { sendEmailHandler } from "../controllers/emailController.js";

const router = express.Router();

router.post("/send", sendEmailHandler);

export default router;
