// backend/index.js
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/login_signup.js";
import complaintRoutes from "./routes/post.js";
import statusRoutes from "./routes/status_change.js";
import resolvementRoutes from "./routes/post_update.js";
import heatmapRoutes from "./routes/heatmap.js";
import statsRouter from "./routes/stats.js";
import slaRoutes from "./routes/slaRoutes.js";

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/auth", authRoutes);
app.use("/", complaintRoutes);
app.use("/", statusRoutes);
app.use("/", resolvementRoutes);
app.use("/api/posts", heatmapRoutes);
app.use("/api/stats", statsRouter);
app.use("/api", slaRoutes);

// Create server + socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// 🔹 Socket.IO events
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // Join a group room
  socket.on("joinGroup", (group_id) => {
    if (!group_id) return;
    socket.join(`group_${group_id}`);
    console.log(`User ${socket.id} joined group_${group_id}`);
  });
  socket.on("joinPost", (post_id) => {
    socket.join(`post_${post_id}`);
    console.log(`User joined post_${post_id}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Export socket instance for use in routes (optional)
export { io };
