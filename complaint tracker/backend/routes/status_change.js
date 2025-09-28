import express from "express";
import { changePostStatus } from "../controllers/status_changeController.js";

const router = express.Router();

router.post("/changePostStatus", changePostStatus);

export default router;
