// frontend/src/api/slaApi.js
import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:5000", // backend server port
});

// fetch SLA stats from backend
export const fetchSla = (thresholdHours) =>
  api.get('/api/sla', { params: { threshold_hours: thresholdHours } })
     .then(res => res.data);
