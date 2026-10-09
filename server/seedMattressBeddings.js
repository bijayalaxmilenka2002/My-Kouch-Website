import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Product from './models/Product.js';

const mattressProducts = [
  {
    name: 'myKouch Imperial Orthopedic Euro-Top Pocket Spring Hybrid Mattress',
    slug: 'mykouch-imperial-orthopedic-euro-top-pocket-spring-mattress',
    description:
      'Flagship orthopedic hybrid sleep system engineered for perfect spinal alignment and zero-motion disturbance. Combines individually encased carbon steel pocket coils with a deep Euro-top comfort cushion, breathable geometric knit jacquard ticking, and fluted charcoal sidewalls with ergonomic transport handles.',
    category: 'Mattress & Beddings',
    subType: 'pocket-spring',
    images: [
      '/assets/mattresses/imperial_orthopedic_euro_top_pocket_spring_mattress.jpg',
      '/assets/mattresses/pocket_spring_hybrid_hero.jpg',
      '/assets/mattresses/pocket_spring_macro_quilt.jpg',
      '/assets/mattresses/pocket_spring_edge_support.jpg',
      '/assets/mattresses/pocket_spring_cross_section.jpg',
    ],
    price: 34999,
    originalPrice: 49999,
    discount: 30,
    dimensions: '78" L x 72" W x 10" Thick',
    seatingCapacity: 'King Size (78" x 72")',
    colors: ['White Jacquard & Charcoal Fluted Border', 'Slate Grey Accent'],
    materials: [
      'Individually Encased High-Tensile Pocket Coils',
      'Cool-Gel Visco Elastic Memory Foam',
      'High-Density Edge Support Foam Casing',
      'Breathable Chevron Jacquard Ticking',
    ],
    badge: 'Doctor Recommended',
    isNewArrival: true,
    isTopSelling: true,
    isActive: true,
    rating: 5.0,
    reviewsCount: 52,
    specifications: {
      frameMaterial: 'Individually Encased Pocket Spring Chassis with High-Density Perimeter Foam Enclosure',
      foamDensity: '50-Density Visco Elastic Memory Foam + 40D HR Transition Layer',
      suspension: 'Multi-Zone Independent Carbon Steel Pocket Spring Coils (Zero Motion Transfer)',
      warranty: '10 Years Direct Manufacturer Warranty with Zero-Sag Guarantee',
      legs: 'Anti-Skid Bottom Fabric',
      customizable: true,
    },
  },
  {
    name: 'myKouch CloudHaven Baffle-Box Pillow-Top Mattress Topper',
    slug: 'mykouch-cloudhaven-baffle-box-pillow-top-mattress-topper',
    description:
      'Transform any mattress into a 5-star luxury hotel cloud bed. Engineered with a 3-inch high-loft down-alternative microfiber fill enclosed in 300-thread-count breathable cotton percale. Features square baffle-box stitching to prevent filling displacement, and heavy-duty 4-corner elastic anchor bands for a secure, non-slip fit.',
    category: 'Mattress & Beddings',
    subType: 'toppers',
    images: [
      '/assets/beddings/hotel_cloud_baffle_box_mattress_topper.jpg',
    ],
    price: 4999,
    originalPrice: 7499,
    discount: 33,
    dimensions: '78" L x 72" W x 3" Thick (King Size)',
    seatingCapacity: 'King Size (78" x 72")',
    colors: ['Crisp Cloud White', 'Ivory Pearl'],
    materials: [
      '300 TC Breathable Cotton Percale Shell',
      '7D Virgin Down-Alternative Microfiber Fill',
      'Heavy-Duty Elastic Corner Anchors',
    ],
    badge: 'Hotel Cloud Comfort',
    isNewArrival: true,
    isTopSelling: true,
    isActive: true,
    rating: 4.9,
    reviewsCount: 42,
    specifications: {
      frameMaterial: 'Baffle-Box Grid Quilted Construction with Double-Needle Piped Borders',
      foamDensity: '1200 GSM Virgin Down-Alternative Microfiber Loft Layer',
      suspension: '4-Corner Heavy-Duty Elastic Anchor Bands',
      warranty: '3 Years Anti-Clump & Loft Retention Guarantee',
      legs: 'Elastic Corner Straps',
      customizable: true,
    },
  },
  {
    name: 'myKouch Diamond-Quilted 100% Waterproof Fitted Mattress Protector',
    slug: 'mykouch-diamond-quilted-waterproof-fitted-mattress-protector',
    description:
      'Ultimate all-night protection against liquids, spills, sweat, allergens, and dust mites. Features a completely silent, breathable TPU waterproof membrane beneath a plush diamond-quilted microfiber comfort surface. Deep 360-degree all-around stretchable skirt hugs mattresses up to 15 inches thick with zero wrinkles or rustling noise.',
    category: 'Mattress & Beddings',
    subType: 'toppers',
    images: [
      '/assets/beddings/diamond_quilted_waterproof_mattress_protector.jpg',
    ],
    price: 2499,
    originalPrice: 3999,
    discount: 37,
    dimensions: '78" L x 72" W x 15" Deep Skirt',
    seatingCapacity: 'King Size (78" x 72")',
    colors: ['Pure White', 'Warm Ivory'],
    materials: [
      'Diamond-Quilted Hypoallergenic Microfiber',
      'Silent Breathable TPU Waterproof Membrane',
      '360° All-Around Stretchable Poly-Elastane Skirt',
    ],
    badge: '100% Waterproof',
    isNewArrival: true,
    isTopSelling: true,
    isActive: true,
    rating: 5.0,
    reviewsCount: 58,
    specifications: {
      frameMaterial: '360-Degree Deep Pocket Fitted Skirt with Heavy-Duty Elastic Band',
      foamDensity: 'Hypoallergenic Microfiber Cushioning with Thermoplastic Polyurethane Membrane',
      suspension: 'Silent Noise-Free Waterproof Lamination',
      warranty: '5 Years Waterproof Membrane Warranty',
      legs: 'Full Elastic Skirt',
      customizable: true,
    },
  },
  {
    name: 'myKouch ZenComfort Japanese Foldable Futon Floor Mattress & Bedding Topper',
    slug: 'mykouch-zencomfort-foldable-futon-floor-mattress-topper',
    description:
      'Multi-purpose Japanese-style roll-up futon mattress and supportive sleeping floor pad. Crafted with high-density pressure-relieving core wrapped in soft brushed microfiber with square channel tufting. Equipped with reinforced corner straps for mattress overlay or convenient roll-and-store portability for floor sleeping, guest bedding, and meditation.',
    category: 'Mattress & Beddings',
    subType: 'beddings',
    images: [
      '/assets/beddings/zencomfort_foldable_futon_floor_mattress_topper.jpg',
    ],
    price: 5499,
    originalPrice: 8499,
    discount: 35,
    dimensions: '78" L x 60" W x 4" Thick (Queen Size)',
    seatingCapacity: 'Queen Size (78" x 60")',
    colors: ['Slate Grey', 'Charcoal Heather', 'Oatmeal Beige'],
    materials: [
      'Brushed Micro-Peach Fabric Casing',
      'High-Density Aerodynamic Cushion Core',
      'Reinforced Roll-Up Elastic Straps',
    ],
    badge: 'Foldable Futon',
    isNewArrival: true,
    isTopSelling: false,
    isActive: true,
    rating: 4.8,
    reviewsCount: 34,
    specifications: {
      frameMaterial: 'Roll-Up & Foldable Portable Design with Heavy-Duty Corner Elastic Bands',
      foamDensity: 'Dual-Layer Ergonomic Cushion Core with Micro-Peach Surface',
      suspension: 'Multi-Layer Resilient Core with Square Channel Tufting',
      warranty: '5 Years Sag-Free Core Warranty',
      legs: 'Floor & Mattress Overlay Bands',
      customizable: true,
    },
  },
  {
    name: 'myKouch Celestial Wave-Quilted Euro-Pillowtop Cooling Mattress Topper',
    slug: 'mykouch-celestial-wave-quilted-euro-pillowtop-cooling-topper',
    description:
      'Ultra-thick hotel-grade cooling Euro-top mattress topper. Tailored with distinctive deep wave baffle quilting and signature midnight navy piped borders. Infused with cooling hollow conjugate fibers that promote continuous airflow while cradling shoulders, hips, and lower back for zero-pressure restorative rest.',
    category: 'Mattress & Beddings',
    subType: 'toppers',
    images: [
      '/assets/beddings/royal_luxe_wave_quilted_euro_topper.jpg',
    ],
    price: 5999,
    originalPrice: 8999,
    discount: 33,
    dimensions: '78" L x 72" W x 4" Thick (King Size)',
    seatingCapacity: 'King Size (78" x 72")',
    colors: ['Cloud White & Midnight Navy Piping', 'Ivory Pearl & Slate Accent'],
    materials: [
      'Cooling Breathable Jacquard Ticking',
      'High-Loft 7D Hollow Conjugate Down-Alternative Fill',
      'Contrast Midnight Navy Piping',
    ],
    badge: 'Ultra-Plush Cooling',
    isNewArrival: true,
    isTopSelling: true,
    isActive: true,
    rating: 5.0,
    reviewsCount: 61,
    specifications: {
      frameMaterial: 'Deep Wave Baffle-Box Stitching with Dual-Edge Contrast Navy Piping',
      foamDensity: '1400 GSM Extra-Loft Cooling Hollow Fiber Filling',
      suspension: 'Deep Elastic Anchor Skirt for Secure Zero-Slip Hold',
      warranty: '3 Years Anti-Clump & Shape Retention Guarantee',
      legs: 'Deep Elastic Fitted Skirt',
      customizable: true,
    },
  },
];

async function seedMattresses() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mykouch';
  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(uri);
  console.log('✓ Connected to MongoDB');

  for (const item of mattressProducts) {
    const existing = await Product.findOne({ slug: item.slug });
    if (existing) {
      await Product.updateOne({ slug: item.slug }, { $set: item });
      console.log(`✓ Updated: ${item.name} [Type: ${item.subType}]`);
    } else {
      await Product.create(item);
      console.log(`✓ Created: ${item.name} [Type: ${item.subType}]`);
    }
  }

  const count = await Product.countDocuments({ category: 'Mattress & Beddings' });
  console.log(`\nTotal Mattress & Beddings in DB: ${count}`);
  await mongoose.disconnect();
  console.log('Done!');
  process.exit(0);
}

seedMattresses().catch((err) => {
  console.error('Seed Error:', err);
  process.exit(1);
});
