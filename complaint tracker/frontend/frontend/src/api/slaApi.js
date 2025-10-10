// frontend/src/api/slaApi.js
import axios from 'axios';

const api = axios.create({
  baseURL:`${process.env.REACT_APP_BACKEND}`, // backend server port
});

// fetch SLA stats from backend
export const fetchSla = (thresholdHours) =>
  api.get('/api/sla', { params: { threshold_hours: thresholdHours } })
     .then(res => res.data);
