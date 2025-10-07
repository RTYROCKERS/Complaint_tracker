// frontend/src/api/heatmap.js
import axios from "axios";

const BASE = "http://localhost:5000";

export const getHeatmapPosts = async (city = "", locality = "") => {
  try {
    const res = await axios.get(`${BASE}/api/posts/heatmap`, {
      params: { city, locality },
    });
    return res.data; // array of { latitude, longitude, type, days_required, post_id }
  } catch (err) {
    console.error("Error fetching heatmap posts:", err?.message || err);
    return [];
  }
};

export const getCityLocalities = async () => {
  try {
    const res = await axios.get(`${BASE}/api/posts/getlocations`);
    return res.data;
  } catch (err) {
    console.error("Error fetching city-locality combinations:", err?.message || err);
    return {};
  }
};
