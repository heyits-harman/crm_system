import express from 'express';
import { createUser, loginUser, getUsers } from '../controllers/user';
import authValidation from '../middleware/auth';

const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);

// Protected: only authenticated users (admin) can list users for assignment
router.get('/', authValidation, getUsers);

export default router;