import express from 'express';
import {
  getActiveOffers,
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from '../controllers/offerController.js';
import { protectOwner } from '../middleware/auth.js';

const router = express.Router();

router.get('/active', getActiveOffers);

router.route('/')
  .get(protectOwner, getAllOffers)
  .post(protectOwner, createOffer);

router.route('/:id')
  .put(protectOwner, updateOffer)
  .delete(protectOwner, deleteOffer);

export default router;
