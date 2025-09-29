import express from "express";
import { getComplaints } from "../controllers/Complaint.controller.js";

const router = express.Router();

router.get("/", getComplaints);

export default router;
