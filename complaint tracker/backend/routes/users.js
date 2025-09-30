import express from "express";
import { registerDeviceToken, updateNotifyPrefs } from "../controllers/usersController.js";
const router = express.Router();

router.post("/:id/device-token", registerDeviceToken);
router.put("/:id/notify-prefs", updateNotifyPrefs);

export default router;
