import express from 'express';
import { getDashboardStats } from '../controllers/dashborad'

const router = express.Router();

router.get('/stats', getDashboardStats);

export default router;