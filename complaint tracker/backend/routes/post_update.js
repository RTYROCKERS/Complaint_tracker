import express from "express";
import upload from "../upload.js";
import { addResolvement,getResolvements} from "../controllers/post_updateController.js";

const router = express.Router();

router.post("/postResolvement", upload.single("photo"), addResolvement);
router.post("/getUpdates", getResolvements);

export default router;
