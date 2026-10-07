import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import Offer from '../models/Offer.js';
import Enquiry from '../models/Enquiry.js';
import Testimonial from '../models/Testimonial.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mykouch';

const seedProducts = [
  // 1. L-Shaped Sofas
  {
    name: 'myKouch Royal Emerald Velvet L-Shape Sectional',
    slug: 'mykouch-royal-emerald-velvet-l-shape',
    description: 'A masterpiece of contemporary luxury. Upholstered in jewel-tone emerald green royal velvet with geometric diamond tufting, bow-tie accent buttons, and champagne gold electroplated metal legs. Features deep ergonomic seats with 40-density high-resilience memory foam for cloud-like comfort.',
    category: 'L-Shaped Sofas',
    images: [
      '/assets/sofas/drawing_room_1_2.jpg',
      '/assets/sofas/drawing_room_1_12.jpg',
      '/assets/sofas/drawing_room_1_10.jpg',
    ],
    price: 54999,
    originalPrice: 78999,
    discount: 30,
    dimensions: '108" L x 72" W x 34" H (Customizable to your room)',
    seatingCapacity: '6 - 7 Seater',
    colors: ['Emerald Teal', 'Royal Navy', 'Warm Terracotta', 'Ivory Beige', 'Charcoal Grey'],
    materials: ['Royal Velvet', 'Stain-Resistant Chenille', 'Bouclé'],
    badge: 'Bestseller',
    isNewArrival: false,
    isTopSelling: true,
    rating: 4.9,
    reviewsCount: 38,
    specifications: {
      frameMaterial: 'Termite-Proof Treated Sal & Marandi Hardwood Frame',
      foamDensity: '40 Density High Resilience (HR) Supersoft Foam with Memory Layer',
      suspension: 'Heavy-Gauge Carbon Zig-Zag Springs & Reinforced Poly-Webbing',
      warranty: '10 Years Frame & Structural Warranty',
      legs: 'Solid Metal Legs with Electroplated Champagne Gold Finish',
      customizable: true,
    },
  },
  {
    name: 'myKouch Tuscany Quilted L-Shaped Corner Sofa',
    slug: 'mykouch-tuscany-quilted-l-shaped-corner-sofa',
    description: 'Designed for spacious open-concept living rooms. Features tailored diamond-stitched lumbar cushions, curved armrests, and dual-tone upholstery combining premium beige suede with espresso brown leatherette trims.',
    category: 'L-Shaped Sofas',
    images: [
      '/assets/sofas/drawing_room_1_12.jpg',
      '/assets/sofas/drawing_room_1_11.jpg',
      '/assets/sofas/drawing_room_1_15.jpg',
    ],
    price: 49999,
    originalPrice: 69999,
    discount: 28,
    dimensions: '102" L x 68" W x 35" H',
    seatingCapacity: '5 - 6 Seater',
    colors: ['Beige & Espresso', 'Charcoal & Grey', 'Olive & Walnut', 'Desert Sand'],
    materials: ['Textured Suede', 'Breathable Leatherette', 'Polyester Velvet'],
    badge: 'Trending',
    isNewArrival: false,
    isTopSelling: true,
    rating: 4.8,
    reviewsCount: 29,
    specifications: {
      frameMaterial: 'Seasoned Solid Hardwood with Anti-Borer Treatment',
      foamDensity: '38 Density High Density Rebound Foam',
      suspension: 'High-Tensile S-Springs & 3-Inch Elastic Webbing',
      warranty: '10 Years Manufacturer Warranty',
      legs: 'Brushed Golden Alloy Base Caps',
      customizable: true,
    },
  },
  {
    name: 'myKouch Celestia Sky Blue Sectional with Ottoman',
    slug: 'mykouch-celestia-sky-blue-sectional',
    description: 'Elevate your living space with the Celestia sectional in soothing sky blue ribbed velvet. Comes with a matching oversized center ottoman with tufted top and built-in storage capabilities upon request.',
    category: 'L-Shaped Sofas',
    images: [
      '/assets/sofas/drawing_room_1_10.jpg',
      '/assets/sofas/drawing_room_1_13.jpg',
    ],
    price: 58999,
    originalPrice: 84999,
    discount: 30,
    dimensions: '112" L x 76" W x 33" H',
    seatingCapacity: '7 Seater',
    colors: ['Sky Blue', 'Mint Green', 'Cream White', 'Dove Grey'],
    materials: ['Ribbed Plush Velvet', 'Performance Chenille'],
    badge: 'Luxury Edition',
    isNewArrival: true,
    isTopSelling: true,
    rating: 5.0,
    reviewsCount: 16,
    specifications: {
      frameMaterial: 'Kiln-Dried Solid Pine & Hardwood Reinforcements',
      foamDensity: '42 Density High Resilient Foam with Feather Blend Topper',
      suspension: 'German Engineered Pocket Springs Matrix',
      warranty: '10 Years Frame Warranty',
      legs: 'Concealed Heavy-Duty Low Profile Wood Feet',
      customizable: true,
    },
  },
  {
    name: 'myKouch Aurelia Rose Velvet Corner Lounger',
    slug: 'mykouch-aurelia-rose-velvet-corner-lounger',
    description: 'Sophisticated dusty rose velvet sectional with handcrafted Chesterfield deep button tufting along the side arms and ottoman. Perfectly suited for contemporary apartments craving a romantic aesthetic.',
    category: 'L-Shaped Sofas',
    images: [
      '/assets/sofas/drawing_room_1_11.jpg',
      '/assets/sofas/drawing_room_1_14.jpg',
    ],
    price: 52999,
    originalPrice: 74999,
    discount: 29,
    dimensions: '98" L x 66" W x 34" H',
    seatingCapacity: '5 Seater',
    colors: ['Dusty Rose', 'Champagne Beige', 'Lavender Mist', 'Warm Ochre'],
    materials: ['Silk Velvet', 'Italian Bouclé'],
    badge: 'Popular',
    isNewArrival: false,
    isTopSelling: false,
    rating: 4.8,
    reviewsCount: 21,
    specifications: {
      frameMaterial: 'Solid Sal Wood Structure with Corner Blocks',
      foamDensity: '35 Density Memory Infused Foam',
      suspension: 'Zig-zag Springs with Sound Dampeners',
      warranty: '10 Years Frame Warranty',
      legs: 'Tapered Brass Plated Steel Legs',
      customizable: true,
    },
  },

  // 2. Sofa Combos (3+1+1 and Suites)
  {
    name: 'myKouch Imperial Fluted 3+1+1 Living Room Suite',
    slug: 'mykouch-imperial-fluted-311-suite',
    description: 'The epitome of classic Indian luxury. A complete 5-seater sofa suite comprising a stately 3-seater linear sofa and two royal single lounge chairs. Features vertical channel fluting in pristine ivory white fabric with golden leaf accents on the armrest profiles.',
    category: 'Sofa Combos',
    images: [
      '/assets/sofas/drawing_room_1_16.jpg',
      '/assets/sofas/drawing_room_1_1.jpg',
      '/assets/sofas/drawing_room_1_18.jpg',
    ],
    price: 68999,
    originalPrice: 99999,
    discount: 31,
    dimensions: '3-Seater: 84" L x 36" D x 34" H | 1-Seater (x2): 38" L x 36" D x 34" H',
    seatingCapacity: '5 Seater (3 + 1 + 1)',
    colors: ['Pristine Ivory', 'Royal Maroon', 'Charcoal Slate', 'Emerald Gold'],
    materials: ['Fluted Microfiber Fabric', 'Italian Leatherette', 'Velvet'],
    badge: 'Showroom Pick',
    isNewArrival: false,
    isTopSelling: true,
    rating: 4.9,
    reviewsCount: 42,
    specifications: {
      frameMaterial: 'Solid Sal Hardwood with Moisture & Borer Resistance',
      foamDensity: '40 Density HR Foam + Supersoft Cloud Layer',
      suspension: 'Interwoven Webbing & Carbon Steel Springs',
      warranty: '10 Years Frame Warranty',
      legs: 'Custom Gold Tipped Wooden Stumps',
      customizable: true,
    },
  },
  {
    name: 'myKouch Bordeaux Vintage 3+1+1 Leatherette Set',
    slug: 'mykouch-bordeaux-vintage-leatherette-set',
    description: 'Stately deep burgundy maroon leatherette suite with diamond button tufting and sculpted wooden arm caps. Offers unmatched durability, effortless wipe-clean maintenance, and grand heritage aesthetics.',
    category: 'Sofa Combos',
    images: [
      '/assets/sofas/drawing_room_1_1.jpg',
      '/assets/sofas/drawing_room_1_17.jpg',
    ],
    price: 62999,
    originalPrice: 89999,
    discount: 30,
    dimensions: '3-Seater: 82" L x 35" D | 1-Seater: 36" L x 35" D',
    seatingCapacity: '5 Seater (3 + 1 + 1)',
    colors: ['Bordeaux Maroon', 'Espresso Brown', 'Cognac Tan', 'Jet Black'],
    materials: ['Automotive-Grade Breathable Leatherette', 'Solid Wood Accents'],
    badge: 'Heritage',
    isNewArrival: false,
    isTopSelling: true,
    rating: 4.7,
    reviewsCount: 31,
    specifications: {
      frameMaterial: 'Heavy Seasoned Hardwood Framework',
      foamDensity: '40 Density Heavy Duty Foam',
      suspension: 'Steel Wire Grid & Carbon Springs',
      warranty: '10 Years Frame Warranty',
      legs: 'Carved Hardwood Feet in Walnut Polish',
      customizable: true,
    },
  },
  {
    name: 'myKouch Dual-Tone Cyan 3+1+1 Contemporary Set',
    slug: 'mykouch-dual-tone-cyan-311-set',
    description: 'Dynamic two-tone styling featuring striking cyan blue and graphite grey panels. Built with wide track arms, integrated cushion bolsters, and ergonomic lower back support for everyday family relaxation.',
    category: 'Sofa Combos',
    images: [
      '/assets/sofas/drawing_room_1_18.jpg',
      '/assets/sofas/drawing_room_1_3.jpg',
    ],
    price: 54999,
    originalPrice: 76999,
    discount: 28,
    dimensions: '3-Seater: 80" L x 34" D | 1-Seater: 35" L x 34" D',
    seatingCapacity: '5 Seater (3 + 1 + 1)',
    colors: ['Cyan & Graphite', 'Mustard & Charcoal', 'Rust & Ivory', 'Teal & Grey'],
    materials: ['High GSM Textured Suede', 'Spill-Resistant Fabric'],
    badge: 'Family Favorite',
    isNewArrival: false,
    isTopSelling: false,
    rating: 4.8,
    reviewsCount: 19,
    specifications: {
      frameMaterial: 'Sal Wood Main Framework with Plywood Reinforcements',
      foamDensity: '36 Density Resilient Foam',
      suspension: 'Elastic Webbing with Silent Springs',
      warranty: '10 Years Frame Warranty',
      legs: 'Square Solid Polymer / Wood Blocks',
      customizable: true,
    },
  },

  // 3. 3-Seater Sofas
  {
    name: 'myKouch Versailles Fluted 3-Seater Linear Sofa',
    slug: 'mykouch-versailles-fluted-3-seater',
    description: 'Clean lines meet timeless architectural fluting. The Versailles 3-seater provides generous seating for three adults with continuous channel backrests, curved shelter arms, and premium brass feet.',
    category: '3 Seater Sofas',
    images: [
      '/assets/sofas/drawing_room_1_20.jpg',
      '/assets/sofas/drawing_room_1_4.jpg',
    ],
    price: 38999,
    originalPrice: 54999,
    discount: 29,
    dimensions: '84" L x 36" D x 34" H',
    seatingCapacity: '3 Seater',
    colors: ['Ivory Cream', 'Sage Green', 'Terracotta Orange', 'Midnight Blue'],
    materials: ['Ultra-Soft Fluted Velvet', 'Belgian Linen Blend'],
    badge: 'Bestseller',
    isNewArrival: false,
    isTopSelling: true,
    rating: 4.9,
    reviewsCount: 35,
    specifications: {
      frameMaterial: 'Treated Sal Hardwood',
      foamDensity: '40 Density High Resilience Foam',
      suspension: 'Zig-zag Springs & Webbing',
      warranty: '10 Years Frame Warranty',
      legs: 'Brushed Golden Metal Legs',
      customizable: true,
    },
  },
  {
    name: 'myKouch Nordic Minimalist 3-Seater Sofa',
    slug: 'mykouch-nordic-minimalist-3-seater',
    description: 'Scandinavian-inspired linear sofa with clean boxy cushions, generous seat depth, and tactile bouclé upholstery that brings warmth and Scandinavian tranquility into modern homes.',
    category: '3 Seater Sofas',
    images: [
      '/assets/sofas/drawing_room_1_21.jpg',
      '/assets/sofas/drawing_room_1_22.jpg',
    ],
    price: 34999,
    originalPrice: 48999,
    discount: 28,
    dimensions: '78" L x 35" D x 33" H',
    seatingCapacity: '3 Seater',
    colors: ['Oatmeal Bouclé', 'Sand Tan', 'Slate Grey', 'Olive Moss'],
    materials: ['Heavy Textured Bouclé', 'Premium Chenille'],
    badge: 'New Arrival',
    isNewArrival: true,
    isTopSelling: false,
    rating: 4.8,
    reviewsCount: 14,
    specifications: {
      frameMaterial: 'Kiln-Dried Hardwood Frame',
      foamDensity: '35 Density Memory-Enhanced Foam',
      suspension: 'Heavy Gauge Elastic Webbing',
      warranty: '10 Years Frame Warranty',
      legs: 'Natural Tapered Oak Legs',
      customizable: true,
    },
  },
  {
    name: 'myKouch Chesterfield Royal Velvet 3-Seater',
    slug: 'mykouch-chesterfield-royal-velvet-3-seater',
    description: 'Timeless British craftsmanship tailored for modern spaces. Deep hand-buttoned diamond tufts across the rolled back and arms with individually applied upholstery studs.',
    category: '3 Seater Sofas',
    images: [
      '/assets/sofas/drawing_room_1_23.jpg',
      '/assets/sofas/drawing_room_1_24.jpg',
    ],
    price: 42999,
    originalPrice: 59999,
    discount: 28,
    dimensions: '88" L x 38" D x 32" H',
    seatingCapacity: '3 Seater',
    colors: ['Forest Green', 'Royal Navy Blue', 'Rich Cognac', 'Charcoal'],
    materials: ['Silk Velvet', 'Vintage Distressed Leatherette'],
    badge: 'Classic Choice',
    isNewArrival: false,
    isTopSelling: true,
    rating: 4.9,
    reviewsCount: 27,
    specifications: {
      frameMaterial: 'Solid Sal Wood Framework',
      foamDensity: '40 Density High Resilience Foam',
      suspension: 'Heavy Gauge Hand-Tied Coil System',
      warranty: '10 Years Frame Warranty',
      legs: 'Turned Solid Wooden Legs with Brass Castors',
      customizable: true,
    },
  },

  // 4. Recliner Sofas
  {
    name: 'myKouch CloudMotion Motorized Luxury Recliner',
    slug: 'mykouch-cloudmotion-motorized-luxury-recliner',
    description: 'Experience zero-gravity relaxation with silent motorized footrest extension and infinite-position recline. Features built-in USB-C fast charging port, soft lumbar air cushions, and breathable Napa leatherette.',
    category: 'Recliner Sofas',
    images: [
      '/assets/sofas/drawing_room_1_25.jpg',
      '/assets/sofas/drawing_room_1_26.jpg',
    ],
    price: 36999,
    originalPrice: 52999,
    discount: 30,
    dimensions: '38" W x 40" D x 42" H (Fully reclined: 66" D)',
    seatingCapacity: 'Single Recliner',
    colors: ['Espresso Brown', 'Cognac Tan', 'Charcoal Slate', 'Bone Cream'],
    materials: ['Napa-Grade Breathable Leatherette', 'High Performance Suede'],
    badge: 'Bestseller',
    isNewArrival: false,
    isTopSelling: true,
    rating: 5.0,
    reviewsCount: 46,
    specifications: {
      frameMaterial: 'Heavy Duty Steel Mechanism & Hardwood Enclosure',
      foamDensity: '45 Density Molded Ergonomic Polyurethane Foam',
      suspension: 'German OKIN Motor & Dual Tension Springs',
      warranty: '10 Years Frame & 3 Years Motor Warranty',
      legs: 'Heavy-Duty 360-Degree Swivel Base',
      customizable: true,
    },
  },
  {
    name: 'myKouch Grand Cinema 3-Seater Dual Motor Recliner',
    slug: 'mykouch-grand-cinema-3-seater-dual-motor-recliner',
    description: 'Bring the private cinema experience to your living room. A 3-seater powerhouse where both outer seats independently recline at the touch of a button. Features drop-down center console with dual stainless cup holders and concealed storage.',
    category: 'Recliner Sofas',
    images: [
      '/assets/sofas/drawing_room_1_27.jpg',
      '/assets/sofas/drawing_room_1_28.jpg',
    ],
    price: 74999,
    originalPrice: 104999,
    discount: 28,
    dimensions: '86" L x 40" D x 42" H',
    seatingCapacity: '3 Seater Recliner',
    colors: ['Midnight Black', 'Chocolate Brown', 'Smoke Grey'],
    materials: ['Heavy-Duty Bonded Leatherette', 'Stain-Resistant Microfiber'],
    badge: 'Home Cinema',
    isNewArrival: true,
    isTopSelling: true,
    rating: 4.9,
    reviewsCount: 22,
    specifications: {
      frameMaterial: 'Industrial Steel Frame Structure',
      foamDensity: '42 Density High Resilience Molded Foam',
      suspension: 'Twin Heavy-Duty German Actuator Motors',
      warranty: '10 Years Frame & 3 Years Mechanism Warranty',
      legs: 'Anti-Skid Steel Anchors',
      customizable: true,
    },
  },

  // 5. 2-Seater Sofas / Loveseats
  {
    name: 'myKouch Haven Compact Velvet Loveseat',
    slug: 'mykouch-haven-compact-velvet-loveseat',
    description: 'Designed specifically for modern apartments, bedrooms, and cozy conversation nooks. Deep seating with slim track arms to maximize sitting area without consuming floor space.',
    category: '2 Seater Sofas',
    images: [
      '/assets/sofas/drawing_room_1_29.jpg',
      '/assets/sofas/drawing_room_1_30.jpg',
    ],
    price: 26999,
    originalPrice: 37999,
    discount: 28,
    dimensions: '60" L x 34" D x 33" H',
    seatingCapacity: '2 Seater',
    colors: ['Terracotta', 'Emerald', 'Mustard Gold', 'Steel Grey'],
    materials: ['Royal Velvet', 'Bouclé Weave'],
    badge: 'Apartment Pick',
    isNewArrival: false,
    isTopSelling: false,
    rating: 4.8,
    reviewsCount: 18,
    specifications: {
      frameMaterial: 'Solid Sal Wood Framework',
      foamDensity: '38 Density HR Foam',
      suspension: 'High Tensile Webbing & Springs',
      warranty: '10 Years Frame Warranty',
      legs: 'Champagne Gold Plated Metal Legs',
      customizable: true,
    },
  },
  {
    name: 'myKouch Cozy Petite 2-Seater Studio Sofa',
    slug: 'mykouch-cozy-petite-2-seater-studio-sofa',
    description: 'A cozy sanctuary for compact spaces. Soft rounded corners, cloud-soft backrest bolsters, and breathable linen-feel upholstery.',
    category: '2 Seater Sofas',
    images: [
      '/assets/sofas/drawing_room_1_31.jpg',
      '/assets/sofas/drawing_room_1_32.jpg',
    ],
    price: 24999,
    originalPrice: 34999,
    discount: 28,
    dimensions: '56" L x 33" D x 32" H',
    seatingCapacity: '2 Seater',
    colors: ['Ivory Cream', 'Sage Green', 'Warm Rust', 'Charcoal'],
    materials: ['Textured Linen-Cotton Blend', 'Soft Suede'],
    badge: 'New Arrival',
    isNewArrival: true,
    isTopSelling: false,
    rating: 4.7,
    reviewsCount: 12,
    specifications: {
      frameMaterial: 'Seasoned Hardwood Frame',
      foamDensity: '35 Density Soft Foam',
      suspension: 'Elastic Webbing Support',
      warranty: '10 Years Frame Warranty',
      legs: 'Natural Finish Solid Wood Tapered Legs',
      customizable: true,
    },
  },
];

const seedTestimonials = [
  {
    customerName: 'Priyanka Mohapatra',
    location: 'Patia, Bhubaneswar',
    sofaPurchased: 'Royal Emerald Velvet L-Shape Sectional',
    review: 'We visited the myKouch showroom near Bhimatangi and were blown away by the quality. They customized the exact 108-inch dimensions to fit our living room corner perfectly! The emerald velvet fabric is super rich and the high-resilience foam feels heavenly.',
    rating: 5,
  },
  {
    customerName: 'Rajesh & Swati Tripathy',
    location: 'Saheed Nagar, Bhubaneswar',
    sofaPurchased: 'Imperial Fluted 3+1+1 Living Room Suite',
    review: 'Direct factory pricing made a huge difference compared to big retail stores. Getting a 10-year solid sal wood frame warranty with custom champagne gold accents for our 3+1+1 set was unmatched. Delivered and installed directly by the myKouch team.',
    rating: 5,
  },
  {
    customerName: 'Abhimanyu Panda',
    location: 'Khandagiri, Bhubaneswar',
    sofaPurchased: 'CloudMotion Motorized Recliner',
    review: 'The motorized recliner is incredible. The mechanism is whisper-quiet and the lumbar support is the best I have ever sat on. It is genuinely handcrafted comfort that feels like home!',
    rating: 5,
  },
  {
    customerName: 'Sunita Dash',
    location: 'Nayapalli, Bhubaneswar',
    sofaPurchased: 'Tuscany Quilted L-Shaped Corner Sofa',
    review: 'From color selection to exact room measurement, the team was patient and professional. The sofa arrived ahead of schedule, beautifully packed and flawless in stitching. Highly recommend myKouch for anyone looking for authentic sofa manufacturing.',
    rating: 5,
  },
];

const seedOffer = {
  title: 'myKouch Festive Living Room Festival 2026',
  subtitle: 'Direct-From-Factory Sofa Event • Handcrafted in Bhubaneswar',
  description: 'Upgrade your living space with customized luxury sofas. Enjoy up to 35% off on all L-shaped sectionals, 3+1+1 living room suites, and motorized recliners. Includes complimentary at-home fabric consultation and custom room measurements.',
  discount: 'UP TO 35% OFF',
  couponCode: 'COMFORT35',
  image: '/assets/sofas/drawing_room_1_2.jpg',
  startDate: new Date(),
  endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
  ctaText: 'Explore Sofa Offers',
  ctaLink: '/collections',
  isActive: true,
};

const seedInitialEnquiries = [
  {
    customerName: 'Debabrata Jena',
    phone: '+91 94370 12345',
    email: 'debabrata.jena@gmail.com',
    product: 'myKouch Royal Emerald Velvet L-Shape Sectional',
    enquiryType: 'Customization',
    customizationDetails: {
      sofaType: 'L-Shaped Sofas',
      seatingPreference: '6 Seater with Right Chaise',
      preferredSize: '110" x 70"',
      preferredColor: 'Royal Emerald Teal',
      fabricPreference: 'Royal Velvet (Water-Repellent)',
      roomDimensions: '16 ft x 14 ft Living Room',
      customRequirements: 'Require extra firm lumbar cushion and champagne gold legs.',
    },
    message: 'Hello, I want to confirm if you can deliver and assemble at Sailashree Vihar, Bhubaneswar. Please call me.',
    status: 'New',
  },
  {
    customerName: 'Ananya Pattnaik',
    phone: '+91 98610 88776',
    email: 'ananya.p@outlook.com',
    product: 'myKouch Imperial Fluted 3+1+1 Living Room Suite',
    enquiryType: 'Product Enquiry',
    customizationDetails: {
      sofaType: 'Sofa Combos',
      seatingPreference: '3+1+1',
      preferredColor: 'Ivory Cream',
      fabricPreference: 'Fluted Microfiber',
      roomDimensions: '',
      customRequirements: '',
    },
    message: 'Can I visit the Bhimatangi showroom this Saturday to feel the fabric in person?',
    status: 'Contacted',
    ownerNotes: 'Called customer, confirmed appointment for Saturday 11 AM.',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected to MongoDB');

    // 1. Seed Admin
    await Admin.deleteMany({});
    const passwordHash = await Admin.hashPassword('MyKouch@2026');
    const admin = await Admin.create({
      name: 'myKouch Owner',
      email: 'admin@mykouch.in',
      passwordHash,
      role: 'owner',
    });
    console.log(`[Seed] Admin created: ${admin.email} (Password: MyKouch@2026)`);

    // 2. Seed Products
    await Product.deleteMany({});
    const products = await Product.insertMany(seedProducts);
    console.log(`[Seed] ${products.length} sofa products seeded`);

    // 3. Seed Offer
    await Offer.deleteMany({});
    const offer = await Offer.create(seedOffer);
    console.log(`[Seed] Promotional offer seeded: "${offer.title}"`);

    // 4. Seed Testimonials
    await Testimonial.deleteMany({});
    const testimonials = await Testimonial.insertMany(seedTestimonials);
    console.log(`[Seed] ${testimonials.length} testimonials seeded`);

    // 5. Seed Enquiries
    await Enquiry.deleteMany({});
    const enquiries = await Enquiry.insertMany(seedInitialEnquiries);
    console.log(`[Seed] ${enquiries.length} initial enquiries seeded`);

    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
}

seed();
