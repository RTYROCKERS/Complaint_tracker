<<<<<<< Updated upstream
import express from 'express';
import cors from 'cors';
=======
// backend/index.js
import express from "express";
import cors from "cors";
import http from "http";

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("./backend/.env") });

import { Server } from "socket.io";

>>>>>>> Stashed changes
import authRoutes from "./routes/login_signup.js";
import complaintRoutes from "./routes/post.js";
import statusRoutes from "./routes/status_change.js";
import resolvementRoutes from "./routes/post_update.js";
import postsRoutes from "./routes/complaint.js";
import heatmapRoutes from "./routes/heatmap.js"; // default export in heatmap.js

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRoutes);
app.use("/", complaintRoutes);
app.use("/", statusRoutes);
app.use("/", resolvementRoutes);
app.use("/", postsRoutes);

// NEW
app.use("/api/posts", heatmapRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
