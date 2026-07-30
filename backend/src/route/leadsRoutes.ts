import express from 'express';
import { createLead, getLeads, updateLead, deleteLead } from '../controllers/lead';
import { createNote, getNote, deleteNote } from '../controllers/notes';
import { getActivity } from '../controllers/activity';
import authValidation from '../middleware/auth';

const router = express.Router();

// Public Lead creation (for Public Submission Form)
router.post('/create', createLead);

// Protected Lead routes
router.get('/get', authValidation, getLeads);
router.patch('/update/:id', authValidation, updateLead);
router.delete('/delete/:id', authValidation, deleteLead);

// Lead Notes (Protected)
router.post('/:id/notes', authValidation, createNote);
router.get('/:id/notes', authValidation, getNote);
router.delete('/:id/notes', authValidation, deleteNote);

// Lead Activity (Protected)
router.get('/:id/activity', authValidation, getActivity);

export default router;