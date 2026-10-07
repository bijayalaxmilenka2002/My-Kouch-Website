import express from 'express';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      testimonials,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials: ' + error.message,
    });
  }
});

export default router;
