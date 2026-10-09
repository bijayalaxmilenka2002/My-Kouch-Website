import express from 'express';
import { loginOwner, getOwnerProfile, updateOwnerCredentials } from '../controllers/authController.js';
import { protectOwner } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', loginOwner);
router.get('/me', protectOwner, getOwnerProfile);
router.put('/profile', protectOwner, updateOwnerCredentials);

export default router;
