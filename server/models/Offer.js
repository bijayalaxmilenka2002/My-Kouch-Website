import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Offer title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      default: 'Exclusive Factory Direct Pricing & Free Living Room Consultation',
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    discount: {
      type: String,
      default: 'Up to 35% OFF',
    },
    couponCode: {
      type: String,
      default: 'COMFORT2026',
    },
    image: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days ahead
    },
    ctaText: {
      type: String,
      default: 'Claim Sofa Offer',
    },
    ctaLink: {
      type: String,
      default: '/collections',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;
