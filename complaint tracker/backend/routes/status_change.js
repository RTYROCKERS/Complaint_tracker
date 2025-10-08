import express from "express";
import { changePostStatus } from "../controllers/status_changeController.js";

const router = express.Router();
router.post("/posts/status",changePostStatus);
export default router;
