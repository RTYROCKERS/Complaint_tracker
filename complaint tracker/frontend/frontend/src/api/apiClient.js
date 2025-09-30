import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // backend server port
});

// stats
export const getStats = () => API.get("/api/stats");

// complaints (if your backend uses /api/complaints)
export const getComplaints = () => API.get("/api/complaints");
