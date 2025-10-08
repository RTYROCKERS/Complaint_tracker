// backend/index.js
import 'dotenv/config';            // <-- ensure .env is loaded before other modules
import express from 'express';
import cors from 'cors';

import authRoutes from "./routes/login_signup.js";
import complaintRoutes from "./routes/post.js";
import statusRoutes from "./routes/status_change.js";
import resolvementRoutes from "./routes/post_update.js";
import heatmapRoutes from "./routes/heatmap.js";
import statsRouter from "./routes/stats.js";
import slaRoutes from "./routes/slaRoutes.js";
<<<<<<< Updated upstream
import postsRoutes from "./routes/posts.js";
import usersRoutes from "./routes/users.js";

// start scheduled jobs AFTER dotenv is loaded (importing the job will start it)
import "./jobs/slaOverdueNotifier.js";
=======
import "./cron/overdueChecker.js";
import "./triggers/statusChangeWatcher.js";
import "./triggers/emailNotifier.js";  // ✅ added line
>>>>>>> Stashed changes

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// routes
app.use("/auth", authRoutes);
app.use("/", complaintRoutes);
app.use("/", statusRoutes);
app.use("/", resolvementRoutes);
app.use("/api/posts", heatmapRoutes);
app.use("/api/stats", statsRouter);
<<<<<<< Updated upstream

app.use("/api", slaRoutes);
app.use("/posts", postsRoutes);
app.use("/users", usersRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok" })); // optional quick healthcheck
=======
app.use("/api", slaRoutes);   // ✅ SLA route
>>>>>>> Stashed changes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
