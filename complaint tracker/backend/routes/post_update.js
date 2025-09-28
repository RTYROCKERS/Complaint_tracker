import express from "express";
import upload from "../upload.js";
import { addResolvement, addResolvementReply } from "../controllers/post_updateController.js";

const router = express.Router();

router.post("/postResolvement", upload.single("photo"), addResolvement);
router.post("/repliesPostResolvement", upload.single("photo"), addResolvementReply);

export default router;
