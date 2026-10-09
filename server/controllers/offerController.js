import mongoose from 'mongoose';
import Offer from '../models/Offer.js';

// @desc    Get active offer for homepage
// @route   GET /api/offers/active
// @access  Public
// @desc    Get active offer for homepage
// @route   GET /api/offers/active
// @access  Public
export const getActiveOffers = async (req, res) => {
  try {
    const now = new Date();
    // Prioritize newest updated/created active offer
    let offer = await Offer.findOne({
      isActive: true,
      $or: [
        { endDate: { $gte: now } },
        { endDate: null },
      ],
    }).sort({ updatedAt: -1, createdAt: -1 });

    // Fallback: If dates expired but active flag is set, return newest active offer
    if (!offer) {
      offer = await Offer.findOne({ isActive: true }).sort({ updatedAt: -1, createdAt: -1 });
    }

    // Ultimate fallback: newest offer in database
    if (!offer) {
      offer = await Offer.findOne().sort({ updatedAt: -1, createdAt: -1 });
    }

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
    const offers = await Offer.find().sort({ updatedAt: -1, createdAt: -1 });
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

    const isOfferActive = isActive === undefined ? true : (isActive === true || isActive === 'true');

    // If setting to active, deactivate other offers to avoid conflicts
    if (isOfferActive) {
      await Offer.updateMany({}, { isActive: false });
    }

    const offer = new Offer({
      title,
      subtitle: subtitle || 'Exclusive Factory-Direct Pricing & Free Consultation',
      description,
      discount: discount || 'Special Festive Savings',
      couponCode: couponCode || 'COMFORT35',
      image: image || '/assets/offers/luxury_chesterfield_offer.jpg',
      startDate: startDate || new Date(),
      endDate: endDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      ctaText: ctaText || 'Shop All Offers',
      ctaLink: ctaLink || '/collections',
      isActive: isOfferActive,
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
    let offer = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      offer = await Offer.findById(id);
    }

    // If ID is a string like 'off_...' or not found, update the most recent offer or create
    if (!offer) {
      offer = await Offer.findOne().sort({ updatedAt: -1, createdAt: -1 });
    }

    if (offer) {
      // If setting this offer active, ensure others don't conflict
      if (req.body.isActive === true || req.body.isActive === 'true') {
        await Offer.updateMany({ _id: { $ne: offer._id } }, { isActive: false });
      }

      Object.assign(offer, req.body);
      offer.updatedAt = new Date();
      await offer.save();
    } else {
      offer = new Offer({
        ...req.body,
        startDate: req.body.startDate || new Date(),
        endDate: req.body.endDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      });
      await offer.save();
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
