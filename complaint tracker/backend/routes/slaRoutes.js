// backend/routes/slaRoutes.js
import express from 'express';
import { getSlaStats } from '../controllers/slaController.js';

const router = express.Router();

// GET /api/sla?threshold_hours=48
router.get('/sla', getSlaStats);

export default router;
