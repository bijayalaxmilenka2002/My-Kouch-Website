import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: [
        'L-Shaped Sofas',
        '3 Seater Sofas',
        'Sofa Combos',
        'Recliner Sofas',
        '2 Seater Sofas',
        'Mattress & Beddings',
        'Mattresses & Beddings',
        'Pillow & Cushion',
        'Pillows & Cushions',
        'Pillows & Cushion',
      ],
      trim: true,
    },
    subType: {
      type: String,
      default: '',
      trim: true,
    },
    images: {
      type: [String],
      required: true,
      validate: [val => val.length > 0, 'At least one image is required'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    specifications: {
      frameMaterial: { type: String, default: 'Treated Solid Sal / Marandi Wood with Termite Protection' },
      foamDensity: { type: String, default: '32-40 Density High Resilience (HR) Supersoft Foam' },
      suspension: { type: String, default: 'Zig-zag Heavy Carbon Springs & Elastic Webbing' },
      warranty: { type: String, default: '10 Years Structural Frame Warranty' },
      legs: { type: String, default: 'Brushed Golden Electroplated Metal / Solid Wood' },
      customizable: { type: Boolean, default: true },
    },
    dimensions: {
      type: String,
      default: 'Standard Dimensions',
    },
    colors: {
      type: [String],
      default: ['Emerald Green', 'Terracotta Brown', 'Royal Blue', 'Ivory Beige', 'Charcoal Grey'],
    },
    materials: {
      type: [String],
      default: ['Royal Velvet', 'Premium Leatherette', 'Textured Suede'],
    },
    seatingCapacity: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: '',
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isTopSelling: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 24,
    },
  },
  { timestamps: true }
);

// Pre-save to calculate discount if original price provided
productSchema.pre('save', function (next) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
