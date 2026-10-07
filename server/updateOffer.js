import mongoose from 'mongoose';

async function updateOffer() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mykouch');
  const Offer = mongoose.model('Offer', new mongoose.Schema({}, { strict: false }));

  await Offer.updateMany(
    {},
    {
      $set: {
        title: 'These deals are too good to scroll past!',
        subtitle: 'Exclusive Factory Sofa Event • Handcrafted in Bhubaneswar',
        description: 'Upgrade your living space with customized luxury sofas. Enjoy up to 35% off on all sectionals, 3+1+1 suites, and recliners.',
        discount: 'UP TO 35% OFF',
        couponCode: 'COMFORT35',
        image: '/assets/offers/luxury_chesterfield_offer.jpg',
        ctaText: 'Check It Out',
        ctaLink: '/collections?filter=top-selling',
        isActive: true,
      },
    }
  );

  const updated = await Offer.findOne({});
  console.log('=== UPDATED ACTIVE OFFER IN MONGODB ===');
  console.log(JSON.stringify(updated, null, 2));

  await mongoose.disconnect();
}

updateOffer().catch(console.error);
