import express from 'express';
import { createLead, getLeads, updateLead, deleteLead } from '../controllers/lead';

const router = express.Router();

router.post('/create', createLead);
router.get('/get', getLeads);
router.patch('/update', updateLead);
router.delete('/delete', deleteLead);

export default router;