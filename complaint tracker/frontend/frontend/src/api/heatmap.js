// frontend/src/api/posts.js
import axios from "axios";

export const getHeatmapPosts = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/posts/heatmap");
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};
