import express from "express";
import upload from "../upload.js";
import { createGroup, createComplaint, addReply,getGroups,getPosts,getReply, assignment, assignmentRemoval,getOfficials, deletePost } from "../controllers/postController.js";

const router = express.Router();

router.post("/newGroup", createGroup);
router.post("/complaints", upload.single("photo"), createComplaint);
router.post("/replies", upload.single("photo"), addReply);
router.get("/getGroups", getGroups);
router.post("/getPosts", getPosts);
router.post("/getPostReplies",getReply);
router.post("/posts/assignOfficial",assignment);
router.post("/posts/removeOfficial",assignmentRemoval);
router.get("/officials", getOfficials);
router.post("/posts/delete", deletePost);
export default router;
