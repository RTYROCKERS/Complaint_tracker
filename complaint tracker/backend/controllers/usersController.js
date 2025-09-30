// usersController.js
import pool from "../db.js";

export async function registerDeviceToken(req, res) {
  const userId = parseInt(req.params.id, 10);
  const { device_token } = req.body;
  try {
    await pool.query("UPDATE users SET device_token = $1 WHERE u_id = $2", [device_token, userId]);
    res.json({ success: true });
  } catch (err) {
    console.error("registerDeviceToken error:", err);
    res.status(500).json({ error: "Failed to save device token" });
  }
}

export async function updateNotifyPrefs(req, res) {
  const userId = parseInt(req.params.id, 10);
  const { notify_prefs } = req.body;
  try {
    await pool.query("UPDATE users SET notify_prefs = $1 WHERE u_id = $2", [notify_prefs, userId]);
    res.json({ success: true });
  } catch (err) {
    console.error("updateNotifyPrefs error:", err);
    res.status(500).json({ error: "Failed to update preferences" });
  }
}
