import express from 'express';
import { createLead, getLeads, updateLead, deleteLead } from '../controllers/lead';
import { createNote, getNote } from '../controllers/notes'
import { getActivity } from '../controllers/activity'

const router = express.Router();

// Leads
router.post('/create', createLead);
router.get('/get', getLeads);
router.patch('/update/:id', updateLead);
router.delete('/delete/:id', deleteLead);

// Lead Notes
router.post('/:id/notes', createNote)
router.get('/:id/notes', getNote)

// Lead Activity
router.get('/:id/activity', getActivity)

export default router;