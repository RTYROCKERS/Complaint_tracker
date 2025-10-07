// backend/routes/heatmap.js
import express from "express";
import { getHeatmapPosts, getCityLocalities } from "../controllers/heatmapController.js";

const router = express.Router();

// GET /api/posts/heatmap
router.get("/heatmap", getHeatmapPosts);
router.get("/getlocations", getCityLocalities);

export default router;
