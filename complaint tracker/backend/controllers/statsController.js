import { fetchComplaintStats } from "../services/statsService.js";

export const getStats = async (req, res) => {
  try {
    const stats = await fetchComplaintStats();
    res.json(stats);
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
