// Centralized Category Configuration for myKouch Website & Owner Portal

export const CATEGORIES = [
  {
    name: 'L-Shaped Sofas',
    slug: 'l-shaped-sofas',
    shortName: 'L-Shape',
    description: 'Expansive corner sectionals and chaise loungers engineered for ultimate living room relaxation.',
    image: '/assets/sofas/drawing_room_1_12.jpg',
    badge: 'Trending Design',
    count: '15+ Configurations',
    type: 'sofa',
    metaTitle: 'L-Shaped Sectional Sofas • Handcrafted Luxury',
    metaDesc: 'Explore custom L-shaped corner sofas in Bhubaneswar. High resilience foam and solid Sal wood frames.',
  },
  {
    name: 'Sofa Combos',
    slug: 'sofa-combos',
    shortName: 'Sofa Combos',
    description: 'Stately complete suites pairing a 3-seater centerpiece with matching individual royal armchairs.',
    image: '/assets/sofas/drawing_room_1_16.jpg',
    badge: 'Living Room Suite',
    count: '12+ Sets',
    type: 'sofa',
    metaTitle: '3+1+1 Sofa Combos & Living Suites • Handcrafted Luxury',
    metaDesc: 'Complete 5-seater living room sofa sets with matching armchairs made in Bhubaneswar.',
  },
  {
    name: '3 Seater Sofas',
    slug: '3-seater-sofas',
    shortName: '3 Seater',
    description: 'Timeless architectural sofas with deep seating, fluted backrests, and modern silhouettes.',
    image: '/assets/sofas/drawing_room_1_21.jpg',
    badge: 'Popular',
    count: '20+ Styles',
    type: 'sofa',
    metaTitle: '3 Seater Designer Sofas • Handcrafted Luxury',
    metaDesc: 'Comfortable 3-seater luxury sofas in 100+ velvet and bouclé fabrics with 10-year warranty.',
  },
  {
    name: 'Recliner Sofas',
    slug: 'recliner-sofas',
    shortName: 'Recliners',
    description: 'Motorized and manual zero-gravity recliners featuring lumbar support and whisper-quiet motors.',
    image: '/assets/sofas/drawing_room_1_25.jpg',
    badge: 'Ergonomic Luxury',
    count: '8+ Models',
    type: 'sofa',
    metaTitle: 'Motorized Recliner Sofas • Handcrafted Luxury',
    metaDesc: 'Experience motorized recliners with German mechanics and ergonomic lumbar support.',
  },
  {
    name: '2 Seater Sofas',
    slug: '2-seater-sofas',
    shortName: '2 Seater',
    description: 'Compact love-seats and studio couches designed for apartments, bedrooms, and office suites.',
    image: '/assets/sofas/drawing_room_1_3.jpg',
    badge: 'Apartment Fit',
    count: '10+ Styles',
    type: 'sofa',
    metaTitle: '2 Seater Studio Sofas • Handcrafted Luxury',
    metaDesc: 'Chic 2-seater sofas tailored for compact rooms, bedrooms, and executive lounges.',
  },
  {
    name: 'Mattress & Beddings',
    slug: 'mattress-beddings',
    shortName: 'Mattress & Beddings',
    description: 'Orthopedic memory foam mattresses, pocketed spring systems, and hotel-grade luxury beddings crafted for rejuvenating sleep.',
    image: '/assets/categories/mattress_beddings_cover.jpg',
    badge: 'Orthopedic Comfort',
    count: 'King & Queen Sizes',
    type: 'bedding',
    metaTitle: 'Luxury Mattresses & Beddings • Orthopedic Sleep by myKouch',
    metaDesc: 'Explore custom orthopedic memory foam mattresses, pocket spring systems, and luxury beddings in Bhubaneswar.',
  },
  {
    name: 'Pillow & Cushion',
    slug: 'pillow-cushion',
    shortName: 'Pillow & Cushion',
    description: 'Plush decorative throw cushions, memory-foam neck pillows, and bouclé accent pads tailored for bespoke living comfort.',
    image: '/assets/categories/pillow_cushion_cover.jpg',
    badge: 'Plush Accents',
    count: 'Designer Fabrics',
    type: 'cushion',
    metaTitle: 'Designer Pillows & Cushions • Luxury Accents by myKouch',
    metaDesc: 'Handcrafted decorative sofa cushions and ergonomic memory foam pillows with premium velvet and bouclé covers.',
  },
];

// Helper maps
export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export const SLUG_TO_CATEGORY_MAP = CATEGORIES.reduce((acc, cat) => {
  acc[cat.slug.toLowerCase()] = cat.name;
  acc[cat.name.toLowerCase()] = cat.name;
  return acc;
}, {
  // Legacy or alternative query formats
  'l-shaped-sofas': 'L-Shaped Sofas',
  'l-shaped sofas': 'L-Shaped Sofas',
  'sofa-combos': 'Sofa Combos',
  'sofa combos': 'Sofa Combos',
  '3-seater-sofas': '3 Seater Sofas',
  '3 seater sofas': '3 Seater Sofas',
  'recliner-sofas': 'Recliner Sofas',
  'recliner sofas': 'Recliner Sofas',
  '2-seater-sofas': '2 Seater Sofas',
  '2 seater sofas': '2 Seater Sofas',
  'mattress-beddings': 'Mattress & Beddings',
  'mattress & beddings': 'Mattress & Beddings',
  'pillow-cushion': 'Pillow & Cushion',
  'pillow & cushion': 'Pillow & Cushion',
});

export const CATEGORY_TO_SLUG_MAP = CATEGORIES.reduce((acc, cat) => {
  acc[cat.name] = cat.slug;
  return acc;
}, {});

export function getCategoryBySlugOrName(identifier = '') {
  if (!identifier || identifier === 'All') return null;
  const normalized = identifier.toLowerCase().trim();
  const matchedName = SLUG_TO_CATEGORY_MAP[normalized] || identifier;
  return CATEGORIES.find((c) => c.name.toLowerCase() === matchedName.toLowerCase()) || null;
}
