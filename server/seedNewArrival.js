import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const newArrivalProducts = [
  {
    name: 'myKouch Aurum Luxe Tufted L-Shaped Sectional Suite',
    slug: 'mykouch-aurum-luxe-tufted-l-shaped-sectional',
    description:
      'Exquisite handcrafted modular L-shaped sofa suite featuring deeply tufted channel detailing, opulent electroplated gold metal accents, and matching glass-top coffee table with dual round ottoman poufs. Tailored with 40-density high-resilience foam and kiln-dried solid Sal wood frame for lavish living room luxury.',
    category: 'L-Shaped Sofas',
    images: [
      '/assets/sofas/aurum_luxe_tufted_sectional.jpg',
      '/assets/sofas/aurum_luxe_champagne_beige.jpg',
      '/assets/sofas/aurum_luxe_royal_taupe.jpg',
    ],
    price: 78999,
    originalPrice: 104999,
    discount: 25,
    dimensions: '118" L x 92" W x 34" H (Sofa) + 36" x 36" (Table)',
    colors: ['Muted Mocha Velvet', 'Champagne Beige', 'Royal Taupe'],
    materials: ['High-Density Velvet Fabric', 'Electroplated Gold Stainless Steel Trim', 'Treated Sal Hardwood Frame'],
    seatingCapacity: '7 Seater',
    badge: 'New Workshop Drop',
    specifications: {
      frameMaterial: 'Termite-Treated Kiln-Dried Solid Sal & Marandi Hardwood',
      foamDensity: '40 Density High Resilience (HR) Supersoft Foam',
      suspension: 'High-Tensile Carbon Steel Zig-Zag S-Springs & Reinforced Webbing',
      warranty: '10 Years Structural Frame Warranty',
      legs: 'Electroplated Mirror Gold Metal Footings',
      customizable: true,
    },
    rating: 5.0,
    reviewsCount: 16,
    isNewArrival: true,
    isTopSelling: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'myKouch Horizon Cloud Modular Sectional Sofa',
    slug: 'mykouch-horizon-cloud-modular-sectional',
    description:
      'Spacious contemporary modular sectional sofa with dual chaise lounges and ergonomic horizontal bolster backrests. Engineered for supreme family lounging with breathable textured weave upholstery, 40-density cloud foam, and a heavy-duty reinforced hardwood skeleton.',
    category: 'L-Shaped Sofas',
    images: [
      '/assets/sofas/horizon_grey_modular_sectional.jpg',
      '/assets/sofas/horizon_nordic_mist.jpg',
      '/assets/sofas/horizon_charcoal_heather.jpg',
    ],
    price: 69999,
    originalPrice: 94999,
    discount: 26,
    dimensions: '132" L x 76" D x 33" H',
    colors: ['Dove Slate Grey', 'Nordic Mist', 'Charcoal Heather'],
    materials: ['Heavy-Duty Breathable Linen Weave', '40D High-Resilience Cloud Foam', 'Solid Marandi Wood Frame'],
    seatingCapacity: '6 Seater',
    badge: 'New Workshop Drop',
    specifications: {
      frameMaterial: 'Kiln-Dried Solid Sal Wood with Anti-Borer Treatment',
      foamDensity: 'Dual-Layer 40 Density Supersoft & High-Resilience Foam',
      suspension: 'Pocket Springs & Heavy-Gauge Carbon S-Spring Suspension',
      warranty: '10 Years Structural Frame Warranty',
      legs: 'Low-Profile Recessed Matte Black Hardwood Block Feet',
      customizable: true,
    },
    rating: 4.9,
    reviewsCount: 12,
    isNewArrival: true,
    isTopSelling: false,
    isActive: true,
    createdAt: new Date(Date.now() - 1000), // slightly earlier so Aurum Luxe is first
    updatedAt: new Date(),
  },
];

async function seedToUri(uri, name) {
  if (!uri) return;
  console.log(`\nConnecting to ${name}: ${uri.substring(0, 35)}...`);
  try {
    const conn = await mongoose.createConnection(uri, { serverSelectionTimeoutMS: 5000 }).asPromise();
    console.log(`✓ Connected to ${name}`);

    const Product = conn.model(
      'Product',
      new mongoose.Schema({}, { strict: false })
    );

    for (const item of newArrivalProducts) {
      const existing = await Product.findOne({ slug: item.slug });
      if (existing) {
        await Product.updateOne({ slug: item.slug }, { $set: item });
        console.log(`  ✓ Updated ${item.name} (${item.slug})`);
      } else {
        await Product.create(item);
        console.log(`  ✓ Created ${item.name} (${item.slug})`);
      }
    }

    const count = await Product.countDocuments({ isNewArrival: true, isActive: true });
    console.log(`  => Total Active New Arrivals in ${name}: ${count}`);

    await conn.close();
  } catch (err) {
    console.error(`  ✕ Error with ${name}:`, err.message);
  }
}

async function run() {
  const uris = [
    { uri: process.env.MONGODB_URI, name: 'MongoDB Atlas' },
    { uri: 'mongodb://127.0.0.1:27017/mykouch', name: 'Local MongoDB' },
  ];

  for (const { uri, name } of uris) {
    await seedToUri(uri, name);
  }

  console.log('\n🎉 Finished seeding new arrival sofas!\n');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
