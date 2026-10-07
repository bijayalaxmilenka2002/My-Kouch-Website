import mongoose from 'mongoose';

async function fixDuplicateImages() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mykouch');
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

  // 1. Assign unique distinct photo to Dual-Tone Cyan
  await Product.updateOne(
    { name: /Dual-Tone Cyan/i },
    { $set: { images: ['/assets/sofas/drawing_room_1_18.jpg', '/assets/sofas/drawing_room_1_3.jpg'] } }
  );

  // 2. Assign unique distinct photo to Versailles Fluted
  await Product.updateOne(
    { name: /Versailles Fluted/i },
    { $set: { images: ['/assets/sofas/drawing_room_1_20.jpg', '/assets/sofas/drawing_room_1_4.jpg'] } }
  );

  const list = await Product.find({}, { name: 1, images: 1 });
  console.log('=== VERIFYING UNIQUE IMAGES IN MONGO DATABASE ===');
  const distinctSet = new Set(list.map(p => p.images && p.images[0]));
  console.log('Total Products:', list.length);
  console.log('Unique Images Count:', distinctSet.size);

  list.forEach(p => {
    console.log(`- ${p.name}: ${p.images && p.images[0]}`);
  });

  await mongoose.disconnect();
}

fixDuplicateImages().catch(console.error);
