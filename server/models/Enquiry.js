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
      type: String,
      default: null,
    },
    enquiryType: {
      type: String,
      default: 'General Contact',
      trim: true,
    },
    customizationDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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
