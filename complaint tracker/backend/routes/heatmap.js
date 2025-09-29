import { getHeatmapPosts } from "../controllers/Heatmap.controller.js";
const express = require("express");
const router = express.Router();

// GET /api/posts/heatmap
router.get("/heatmap", getHeatmapPosts);

export default router;