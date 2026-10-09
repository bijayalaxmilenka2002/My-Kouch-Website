import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Product from './models/Product.js';

const pillowProducts = [
  {
    name: 'myKouch Royal Indigo Mediterranean Tile-Medallion & Damask Cushion Suite (Set of 4 + Navy Throw Blanket)',
    slug: 'mykouch-royal-indigo-mediterranean-tile-medallion-cushion-suite',
    description:
      'Bespoke coastal living luxury. A curated living room sofa styling suite featuring four coordinated artisanal cushions: a showstopping Portuguese tile-medallion floral motif pillow, an intricate palm-frond feather pattern cushion, and two deep royal indigo woven textured accent pillows, completed with an ultra-soft waffle-knit navy fringed throw blanket draped over the seat.',
    category: 'Pillow & Cushion',
    subType: 'throw-cushions',
    images: [
      '/assets/pillows/royal_indigo_mediterranean_cushion_suite.jpg',
      '/assets/pillows/designer_living_throw_cushions.jpg',
    ],
    price: 3899,
    originalPrice: 5999,
    discount: 35,
    dimensions: '18" x 18" (45 x 45 cm) [x4] + 50" x 60" Navy Fringed Knit Blanket',
    seatingCapacity: 'Suite of 4 Cushions + 1 Matching Fringed Navy Throw',
    colors: ['Royal Navy Blue', 'Indigo Slub Texture', 'Crisp White Medallion', 'Coastal Denim'],
    materials: [
      'Heavyweight Textured Slub Linen',
      'High-Definition Screen Printed Medallion Canvas',
      'Chunky Fringed Waffle Knit Throw',
      'Concealed YKK Brass Zippers',
    ],
    badge: 'Trending Mediterranean',
    isNewArrival: true,
    isTopSelling: true,
    isActive: true,
    rating: 5.0,
    reviewsCount: 42,
    specifications: {
      frameMaterial: 'Concealed Bottom YKK Zipper with Double-Interlocked Edge Piping',
      foamDensity: '100% Virgin Siliconized Micro-Down Alternative Fiber (700 GSM)',
      suspension: 'Reinforced Overlock Stress-Point Stitching',
      warranty: '2 Years Seam Burst & Fabric Colorfast Guarantee',
      legs: 'Hidden Bottom Zipper Placket',
      customizable: true,
    },
  },
  {
    name: 'myKouch Bohemian Artisanal Macramé & Tufted Tassel Cushion Ensemble (Set of 5 + Handwoven Fringed Throw)',
    slug: 'mykouch-bohemian-artisanal-macrame-tufted-tassel-cushion-ensemble',
    description:
      'Artisanal bohemian tactile mastery for sophisticated Scandinavian living spaces. Handcrafted ensemble featuring five unique textured ivory pillows: diamond lattice knotted macramé, 3D raised floral pom-pom tufts, linear textured loop embroidery, geometric chevron tufting with hand-tied corner tassels, and chunky bobble-stitch knit. Accented with an artisanal open-weave fringed sofa throw blanket.',
    category: 'Pillow & Cushion',
    subType: 'throw-cushions',
    images: [
      '/assets/pillows/bohemian_macrame_tufted_tassel_cushion_suite.jpg',
      '/assets/pillows/designer_living_throw_cushions.jpg',
    ],
    price: 4699,
    originalPrice: 6999,
    discount: 33,
    dimensions: '18" x 18" (45 x 45 cm) [x5] + 55" x 65" Open-Weave Fringe Throw Blanket',
    seatingCapacity: 'Set of 5 Handcrafted Cushions + 1 Handwoven Fringe Throw',
    colors: ['Natural Raw Ivory', 'Warm Ecru Cream', 'Textured Oatmeal Linen'],
    materials: [
      '100% Organic Raw Cotton Macramé Cord',
      'Textured Loop Tufting & Hand-Tied Tassels',
      'Heavy Slub Canvas Backing',
      'Concealed YKK Zippers',
    ],
    badge: 'Handcrafted Macramé',
    isNewArrival: true,
    isTopSelling: true,
    isActive: true,
    rating: 5.0,
    reviewsCount: 58,
    specifications: {
      frameMaterial: 'Hand-Knotted Macramé & 3D Tufted Cotton with Reinforced Edge Seams',
      foamDensity: 'Hypoallergenic Virgin Microfiber Cloud Insert (750 GSM)',
      suspension: 'Heavy-Duty Anti-Fray Backing Canvas with Concealed Zipper',
      warranty: '2 Years Macramé Knots & Fabric Integrity Guarantee',
      legs: 'Concealed Base Zipper Placket',
      customizable: true,
    },
  },
  {
    name: 'myKouch Tuscan Terracotta & Amber Sunburst Botanical Cushion Suite (Set of 4 + Ribbed Terracotta Throw)',
    slug: 'mykouch-tuscan-terracotta-amber-sunburst-botanical-cushion-suite',
    description:
      'Radiant autumn warmth and Italian architectural flair. Hand-tailored styling set featuring four statement cushions: an artistic abstract monstera-leaf botanical silhouette on ivory linen, an optical terracotta chevron stripe pillow, a quilted honeycomb velvet pillow in glowing amber ochre, and an arched sunburst linear embroidered cushion. Draped with a matching cozy ribbed fringed terracotta throw blanket.',
    category: 'Pillow & Cushion',
    subType: 'throw-cushions',
    images: [
      '/assets/pillows/tuscan_terracotta_amber_botanical_cushion_suite.jpg',
      '/assets/pillows/designer_living_throw_cushions.jpg',
    ],
    price: 4199,
    originalPrice: 6499,
    discount: 35,
    dimensions: '18" x 18" (45 x 45 cm) [x4] + 50" x 60" Ribbed Knit Throw Blanket',
    seatingCapacity: 'Suite of 4 Pillows + 1 Matching Fringed Terracotta Throw',
    colors: ['Tuscan Terracotta Rust', 'Amber Ochre Velvet', 'Warm Ivory Cream', 'Burnt Orange'],
    materials: [
      'High-Density Cotton Linen Slub',
      'Honeycomb Quilted Silk Velvet',
      'Ribbed Chenille Acrylic Throw',
      'Concealed YKK Zippers',
    ],
    badge: 'Autumn Harvest Pick',
    isNewArrival: true,
    isTopSelling: true,
    isActive: true,
    rating: 4.9,
    reviewsCount: 49,
    specifications: {
      frameMaterial: 'Precision Chain-Stitch Botanical Embroidery with Concealed Zipper Placket',
      foamDensity: 'High-Loft Virgin Conjugate Down Alternative (700 GSM)',
      suspension: 'Double-Interlocked Overlock Seams with Anti-Pilling Finish',
      warranty: '2 Years Embroidery & Fabric Colorfast Guarantee',
      legs: 'Hidden Bottom Zipper Placket',
      customizable: true,
    },
  },
  {
    name: 'myKouch Nordic Oatmeal & Autumn Harvest Linen Cushion Suite (Set of 4 + Handcrafted Pumpkin Accent & Fringed Throw)',
    slug: 'mykouch-nordic-oatmeal-harvest-linen-cushion-suite',
    description:
      'Tranquil Scandinavian warmth and textural living harmony. Styled in serene earth tones, this ensemble features four artisanal elements: a soft botanical trailing-leaf floral printed linen cushion, a crisp cream woven herringbone cushion, an earthen oatmeal chevron tweed pillow, a sculpted tweed pumpkin novelty bouclé accent cushion with wooden stem, and a lightweight ivory fringed sofa throw.',
    category: 'Pillow & Cushion',
    subType: 'throw-cushions',
    images: [
      '/assets/pillows/nordic_oatmeal_harvest_pumpkin_cushion_suite.jpg',
      '/assets/pillows/designer_living_throw_cushions.jpg',
    ],
    price: 3799,
    originalPrice: 5599,
    discount: 32,
    dimensions: '18" x 18" [x3] + 12" Sculpted Pumpkin Accent + 50" x 60" Fringed Throw Blanket',
    seatingCapacity: 'Suite of 3 Cushions + 1 Pumpkin Novelty Accent + 1 Fringed Throw',
    colors: ['Oatmeal Natural Tweed', 'Sand Taupe Foliage', 'Crisp Cream Herringbone', 'Ivory Fleece'],
    materials: [
      'Textured Wool-Blend Tweed & Slub Linen',
      'Sculpted Bouclé Fleece Novelty Accent',
      'Woven Herringbone Cotton Throw',
      'Concealed YKK Zippers',
    ],
    badge: 'Nordic Harvest Bestseller',
    isNewArrival: true,
    isTopSelling: true,
    isActive: true,
    rating: 5.0,
    reviewsCount: 63,
    specifications: {
      frameMaterial: 'Tailored Knife-Edge Seams with Concealed YKK Bottom Zipper',
      foamDensity: '100% Virgin Siliconized Micro-Down Alternative Fiber (650 GSM)',
      suspension: 'Reinforced Overlock Seaming with Anti-Fray Interior',
      warranty: '2 Years Fabric & Seam Burst Guarantee',
      legs: 'Hidden Bottom Zipper Placket',
      customizable: true,
    },
  },
  {
    name: 'myKouch Serene Lake Dusty Blue Jacquard & Velvet Cushion Suite (Set of 4 + Throw Blanket)',
    slug: 'mykouch-serene-lake-dusty-blue-jacquard-cushion-suite',
    description:
      'Calming coastal living elegance. A curated sofa styling ensemble featuring soft dusty blue brushed velvet cushions, intricate silvery-greige woven damask jacquard pillows, and an ultra-soft matching blue fringed knit throw blanket. Tailored with concealed brass zippers and high-loft virgin micro-cluster filling.',
    category: 'Pillow & Cushion',
    subType: 'throw-cushions',
    images: [
      '/assets/pillows/dusty_blue_jacquard_living_cushion_ensemble.jpg',
      '/assets/pillows/designer_living_throw_cushions.jpg',
    ],
    price: 3899,
    originalPrice: 5999,
    discount: 35,
    dimensions: '18" x 18" (45 x 45 cm) [x4] + 50" x 60" Draped Knit Blanket',
    seatingCapacity: 'Suite of 4 Pillows + 1 Matching Fringed Throw Blanket',
    colors: ['Dusty Slate Blue', 'Silvery Greige Jacquard', 'Sand Beige'],
    materials: [
      'Brushed Silk Velvet',
      'Woven Damask Jacquard',
      'Feather-Soft Fringed Acrylic Knit',
      'Concealed YKK Zippers',
    ],
    badge: 'Bestseller Suite',
    isNewArrival: true,
    isTopSelling: true,
    isActive: true,
    rating: 5.0,
    reviewsCount: 38,
    specifications: {
      frameMaterial: 'Concealed YKK Zipper with Double-Seam Edge Piping & Hand-Tied Tassel Fringe',
      foamDensity: '100% Virgin Siliconized Micro-Down Alternative Fiber (700 GSM)',
      suspension: 'High-Density Interlocking Seam Overlock',
      warranty: '2 Years Seam & Fabric Warranty',
      legs: 'Zipper Base Closure',
      customizable: true,
    },
  },
  {
    name: 'myKouch Tuscany Earth-Tone Velvet & Linen Sectional Cushion Ensemble (Set of 6 + Throw)',
    slug: 'mykouch-tuscany-earth-tone-velvet-sectional-cushion-ensemble',
    description:
      'Designer-coordinated sectional sofa styling package in rich Tuscan warmth. Harmonizes deep wine burgundy crushed velvet, earthy moss olive green, and warm camel tan linen cushion pairs, completed with a plush forest olive knit ottoman throw blanket. Perfectly balanced proportions designed to elevate large L-shaped corner sofas.',
    category: 'Pillow & Cushion',
    subType: 'throw-cushions',
    images: [
      '/assets/pillows/earth_tone_velvet_sectional_cushion_suite.jpg',
      '/assets/pillows/designer_living_throw_cushions.jpg',
    ],
    price: 5499,
    originalPrice: 8499,
    discount: 35,
    dimensions: '20" x 20" (50 x 50 cm) [x2], 18" x 18" [x4] + 50" x 65" Throw Blanket',
    seatingCapacity: '6-Piece Coordinated Sectional Set + 1 Olive Woven Throw',
    colors: ['Deep Burgundy Wine', 'Moss Olive Green', 'Camel Tan Linen'],
    materials: [
      'Heavyweight Royal Velvet',
      'Woven Slub Linen Blend',
      'Textured Ribbed Knit Throw',
      'Hypoallergenic Down Clusters',
    ],
    badge: 'Designer Pick',
    isNewArrival: true,
    isTopSelling: true,
    isActive: true,
    rating: 4.9,
    reviewsCount: 47,
    specifications: {
      frameMaterial: 'Double-Interlocked Overlock Seams with Hidden Heavy-Duty Zippers',
      foamDensity: 'Dual-Core Micro-Down Alternative Fill with High Resiliency',
      suspension: 'Heavy-Duty Reinforced Stress-Point Stitching',
      warranty: '2 Years Anti-Sag & Seam Warranty',
      legs: 'Hidden Bottom Zipper Placket',
      customizable: true,
    },
  },
  {
    name: 'myKouch Cosy Teddy Bouclé & Chunky Cable-Knit Accent Cushion Trio',
    slug: 'mykouch-cosy-teddy-boucle-chunky-knit-accent-cushion-trio',
    description:
      'Textural warmth for cozy Scandinavian interiors. Handcrafted in ultra-tactile teddy curly bouclé shearling in contrasting cream ivory and rich cocoa mocha, accompanied by a matching heavyweight chunky woven cable-knit fringed throw blanket that drapes effortlessly over sofas and accent armchairs.',
    category: 'Pillow & Cushion',
    subType: 'boucle-accents',
    images: [
      '/assets/pillows/teddy_boucle_chunky_knit_accent_cushions.jpg',
      '/assets/pillows/boucle_sherpa_accent_cushion.jpg',
    ],
    price: 3299,
    originalPrice: 4999,
    discount: 34,
    dimensions: '18" x 18" Bouclé [x2], 12" x 18" Lumbar + 50" x 60" Chunky Throw',
    seatingCapacity: 'Trio of 3 Bouclé Cushions + 1 Chunky Cable-Knit Throw',
    colors: ['Cream Ivory Bouclé', 'Cocoa Mocha Brown', 'Oatmeal Heather Knit'],
    materials: [
      'Tactile Curly Bouclé Fleece',
      'Heavy Chunky Knit Woven Yarn',
      'High-Resilience Poly-Down Fill',
    ],
    badge: 'Trending Cozy',
    isNewArrival: true,
    isTopSelling: true,
    isActive: true,
    rating: 5.0,
    reviewsCount: 54,
    specifications: {
      frameMaterial: 'Reinforced Concealed Bottom Zipper with Heavy Cable-Knit Edge Finish',
      foamDensity: 'Dense Hypoallergenic Cloud Cushion Core (650 GSM)',
      suspension: 'Chunky Ribbed Edge Binding',
      warranty: '2 Years Texture & Seam Integrity Guarantee',
      legs: 'Zipper Base Closure',
      customizable: true,
    },
  },
  {
    name: 'myKouch Ark Artisan Handwoven Basketweave Lumbar & Textural Cushion Trio',
    slug: 'mykouch-ark-artisan-handwoven-basketweave-lumbar-cushion-trio',
    description:
      'Sculptural artisanal craftsmanship featuring a showstopping handwoven wide basketweave rectangular lumbar pillow in natural flax cotton ribbon. Paired with a deep burgundy crimson velvet square cushion, a textured rustic tweed earthen brown pillow, and a natural cream fringed sofa runner.',
    category: 'Pillow & Cushion',
    subType: 'lumbar-pillows',
    images: [
      '/assets/pillows/handwoven_basketweave_lumbar_textural_cushions.jpg',
      '/assets/pillows/designer_living_throw_cushions.jpg',
    ],
    price: 3699,
    originalPrice: 5499,
    discount: 33,
    dimensions: '14" x 24" Lumbar (Handwoven) + 18" x 18" Squares [x2] + 45" x 70" Fringe Runner',
    seatingCapacity: '1 Handwoven Lumbar + 2 Accent Cushions + 1 Fringed Sofa Runner',
    colors: ['Natural Flax Basketweave', 'Burgundy Crimson', 'Earthen Tweed Brown'],
    materials: [
      '100% Handwoven Cotton Ribbon Tape',
      'Crushed Royal Velvet',
      'Wool-Blend Houndstooth Tweed',
      'Linen Runner with Fringe',
    ],
    badge: 'Artisan Handwoven',
    isNewArrival: true,
    isTopSelling: true,
    isActive: true,
    rating: 4.9,
    reviewsCount: 29,
    specifications: {
      frameMaterial: 'Interlaced Handwoven Lattice Tape with Concealed Zip Closure',
      foamDensity: 'Firm Ergonomic Lumbar Spine Core + Virgin Microfiber Padding',
      suspension: 'Structural Basketweave Ribbon Webbing',
      warranty: '3 Years Handcraft & Fabric Durability Guarantee',
      legs: 'Concealed Side Zipper',
      customizable: true,
    },
  },
  {
    name: 'myKouch Oasis Botanical Palm & Embroidered Foliage Cushion Suite (Set of 4 + Sage Throw)',
    slug: 'mykouch-oasis-botanical-palm-embroidered-foliage-cushion-suite',
    description:
      'Breathe fresh, revitalizing botanical energy into your living room. Features detailed 3D chain-stitch embroidery depicting a fan palm frond, an olive foliage branch, a geometric four-petal clover motif, and a subtle ladder-stitch framed square, accompanied by an olive sage textured herringbone throw blanket.',
    category: 'Pillow & Cushion',
    subType: 'botanical-cushions',
    images: [
      '/assets/pillows/botanical_palm_embroidered_leaf_cushion_suite.jpg',
      '/assets/pillows/emerald_sofa_cushions_lifestyle.jpg',
    ],
    price: 3999,
    originalPrice: 6299,
    discount: 37,
    dimensions: '18" x 18" (45 x 45 cm) [x4] + 50" x 60" Herringbone Throw',
    seatingCapacity: 'Set of 4 Embroidered Pillows + 1 Sage Herringbone Throw',
    colors: ['Forest Green Embroidery', 'Crisp Canvas Cream', 'Olive Sage Knit'],
    materials: [
      '100% Heavy Cotton Duck Canvas',
      'High-Definition Raised Chain-Stitch Rayon Embroidery Thread',
      'Soft Herringbone Knit Blanket',
    ],
    badge: 'Nature Inspired',
    isNewArrival: true,
    isTopSelling: true,
    isActive: true,
    rating: 5.0,
    reviewsCount: 65,
    specifications: {
      frameMaterial: 'Raised 3D Botanical Embroidery on Heavy Canvas with Hidden Zipper Placket',
      foamDensity: 'Plush Micro-Cluster Down-Alternative Filling (700 GSM)',
      suspension: 'Precision Double-Needle Boundary Stitching',
      warranty: '2 Years Embroidery & Fabric Guarantee',
      legs: 'Hidden Bottom Zipper Placket',
      customizable: true,
    },
  },
];

async function seedPillows() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mykouch';
  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(uri);
  console.log('✓ Connected to MongoDB');

  for (const item of pillowProducts) {
    const existing = await Product.findOne({ slug: item.slug });
    if (existing) {
      await Product.updateOne({ slug: item.slug }, { $set: item });
      console.log(`✓ Updated: ${item.name} [Type: ${item.subType}]`);
    } else {
      await Product.create(item);
      console.log(`✓ Created: ${item.name} [Type: ${item.subType}]`);
    }
  }

  const count = await Product.countDocuments({ category: 'Pillow & Cushion' });
  console.log(`\nTotal Pillows & Cushions in DB: ${count}`);
  await mongoose.disconnect();
  console.log('Done!');
  process.exit(0);
}

seedPillows().catch((err) => {
  console.error('Seed Error:', err);
  process.exit(1);
});
