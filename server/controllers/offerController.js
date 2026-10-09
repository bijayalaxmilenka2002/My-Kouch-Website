import mongoose from 'mongoose';
import Offer from '../models/Offer.js';

// @desc    Get active offer for homepage
// @route   GET /api/offers/active
// @access  Public
export const getActiveOffers = async (req, res) => {
  try {
    const now = new Date();
    // Find active offer whose dates are valid, newest first
    const offer = await Offer.findOne({
      isActive: true,
      $or: [
        { endDate: { $gte: now } },
        { endDate: null },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      offer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch active offer: ' + error.message,
    });
  }
};

// @desc    Get all offers (Owner only)
// @route   GET /api/offers
// @access  Private (Owner)
export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: offers.length,
      offers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch offers: ' + error.message,
    });
  }
};

// @desc    Create new promotional offer (Owner only)
// @route   POST /api/offers
// @access  Private (Owner)
export const createOffer = async (req, res) => {
  try {
    const { title, subtitle, description, discount, couponCode, image, startDate, endDate, ctaText, ctaLink, isActive } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Offer title and description are required',
      });
    }

    const offer = new Offer({
      title,
      subtitle: subtitle || 'Limited Time Factory-Direct Sofa Offer',
      description,
      discount: discount || 'Special Festive Savings',
      couponCode: couponCode || 'COMFORT2026',
      image: image || '',
      startDate: startDate || new Date(),
      endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      ctaText: ctaText || 'Explore Sofa Offer',
      ctaLink: ctaLink || '/collections',
      isActive: isActive === undefined ? true : (isActive === true || isActive === 'true'),
    });

    await offer.save();

    return res.status(201).json({
      success: true,
      message: 'Offer created and published successfully',
      offer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create offer: ' + error.message,
    });
  }
};

// @desc    Update promotional offer (Owner only)
// @route   PUT /api/offers/:id
// @access  Private (Owner)
export const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid offer ID format',
      });
    }

    const offer = await Offer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Offer updated successfully',
      offer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update offer: ' + error.message,
    });
  }
};

// @desc    Delete promotional offer (Owner only)
// @route   DELETE /api/offers/:id
// @access  Private (Owner)
export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid offer ID format',
      });
    }

    const offer = await Offer.findByIdAndDelete(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Offer deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete offer: ' + error.message,
    });
  }
};
