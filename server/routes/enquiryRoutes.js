import express from 'express';
import {
  createEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from '../controllers/enquiryController.js';
import { protectOwner } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(createEnquiry)
  .get(protectOwner, getAllEnquiries);

router.route('/:id')
  .put(protectOwner, updateEnquiryStatus)
  .delete(protectOwner, deleteEnquiry);

export default router;
