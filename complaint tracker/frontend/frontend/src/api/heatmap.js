// frontend/src/api/posts.js
import axios from "axios";

export const getHeatmapPosts = async (city = "", locality = "") => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND}/api/posts/heatmap`, {
      params: { city, locality }, // send city & locality as query parameters
    });
    return res.data; // array of posts with latitude, longitude, type, severity, etc.
  } catch (err) {
    console.error("Error fetching heatmap posts:", err.message);
    return [];
  }
};

export const getCityLocalities = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND}/api/posts/getlocations`);
    return res.data; 
    // returns object like { "Bangalore": ["MG Road", "Indiranagar"], "Prayagraj": ["Civil Lines", "Katra"] }
  } catch (err) {
    console.error("Error fetching city-locality combinations:", err.message);
    return {};
  }
};