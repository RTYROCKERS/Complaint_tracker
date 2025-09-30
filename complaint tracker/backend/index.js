import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/login_signup.js";
import complaintRoutes from "./routes/post.js";
import statusRoutes from "./routes/status_change.js";
import resolvementRoutes from "./routes/post_update.js";
import heatmapRoutes from "./routes/heatmap.js";
import statsRouter from "./routes/stats.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form-data (without files)
app.use("/uploads", express.static("uploads")); // serve uploaded files
app.use("/auth", authRoutes);
app.use("/", complaintRoutes);
app.use("/", statusRoutes);
app.use("/", resolvementRoutes);
app.use("/api/posts", heatmapRoutes);

app.use("/api/stats", statsRouter);


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
