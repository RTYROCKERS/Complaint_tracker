// backend/routes/post.js
import express from "express";
import upload from "../upload.js";
<<<<<<< Updated upstream
import { createGroup, createComplaint, addReply } from "../controllers/postController.js";
=======
import {
  createGroup,
  createComplaint,
  addReply,
  getGroups,
  getPosts,
  getReply,
  assignment,
  assignmentRemoval,
  getOfficials,
  deletePost,
} from "../controllers/postController.js";
>>>>>>> Stashed changes

const router = express.Router();

// ---------------- Existing routes ----------------
router.post("/newGroup", createGroup);
router.post("/complaints", upload.single("photo"), createComplaint);
router.post("/replies", upload.single("photo"), addReply);
<<<<<<< Updated upstream

export default router;
=======
router.get("/getGroups", getGroups);
router.post("/getPosts", getPosts);
router.post("/getPostReplies", getReply);
router.post("/posts/assignOfficial", assignment);
router.post("/posts/removeOfficial", assignmentRemoval);
router.get("/officials", getOfficials);
router.post("/posts/delete", deletePost);

// ---------------- Image Proxy ----------------
router.get("/image-proxy", async (req, res) => {
  const imageUrl = req.query.url;

  if (!imageUrl) return res.status(400).send("Missing image URL");

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return res.status(response.status).send("Image not found");

    const contentType = response.headers.get("content-type");
    const buffer = await response.arrayBuffer();

    res.set("Content-Type", contentType);
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Image proxy error:", err);
    res.status(500).send("Error fetching image");
  }
});

export default router;
>>>>>>> Stashed changes
