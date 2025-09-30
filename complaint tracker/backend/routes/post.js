import express from "express";
import upload from "../upload.js";
import { createGroup, createComplaint, addReply,getGroups,getPosts } from "../controllers/postController.js";

const router = express.Router();

router.post("/newGroup", createGroup);
router.post("/complaints", upload.single("photo"), createComplaint);
router.post("/replies", upload.single("photo"), addReply);
router.get("/getGroups", getGroups);
router.post("/getPosts", getPosts);

export default router;