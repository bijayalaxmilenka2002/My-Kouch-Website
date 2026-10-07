import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    product: {
      type: String,
      default: 'General Sofa Enquiry',
      trim: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    enquiryType: {
      type: String,
      enum: ['Customization', 'Product Enquiry', 'Dealership', 'General Contact'],
      default: 'Customization',
    },
    customizationDetails: {
      sofaType: { type: String, default: '' },
      seatingPreference: { type: String, default: '' },
      preferredSize: { type: String, default: '' },
      preferredColor: { type: String, default: '' },
      fabricPreference: { type: String, default: '' },
      roomDimensions: { type: String, default: '' },
      customRequirements: { type: String, default: '' },
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Progress', 'Completed'],
      default: 'New',
    },
    ownerNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
