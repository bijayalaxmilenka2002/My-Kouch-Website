import express from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { protectOwner } from '../middleware/auth.js';

const router = express.Router();
router.get('/', protectOwner, getDashboardStats);

export default router;
