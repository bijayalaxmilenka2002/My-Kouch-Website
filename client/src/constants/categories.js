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
    image: '/assets/mattresses/tufted_orthopedic_hybrid_mattress.jpg',
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
    image: '/assets/pillows/designer_living_throw_cushions.jpg',
    badge: 'Plush Accents',
    count: 'Designer Fabrics',
    type: 'cushion',
    metaTitle: 'Designer Pillows & Cushions • Luxury Accents by myKouch',
    metaDesc: 'Handcrafted decorative sofa cushions and ergonomic memory foam pillows with premium velvet and bouclé covers.',
  },
];

// Helper maps
export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);
export const SOFA_CATEGORIES = CATEGORIES.filter((c) => c.type === 'sofa');
export const SOFA_CATEGORY_NAMES = SOFA_CATEGORIES.map((c) => c.name);

export const MATTRESS_TYPES = [
  {
    name: 'All Mattresses & Beddings',
    slug: 'all',
    typeKey: 'all',
    badge: 'Complete Range',
    description: 'Complete orthopedic mattresses, cloud toppers & luxury hotel beddings',
    url: '/collections?category=mattress-beddings',
  },
  {
    name: 'Orthopedic Mattresses',
    slug: 'orthopedic',
    typeKey: 'orthopedic',
    badge: 'Spine Alignment',
    description: 'Doctor-recommended dual-comfort ergonomic spine support mattresses',
    url: '/collections?category=mattress-beddings&type=orthopedic',
  },
  {
    name: 'Pocket Spring Mattresses',
    slug: 'pocket-spring',
    typeKey: 'pocket-spring',
    badge: 'Zero-Motion Transfer',
    description: 'Individually encased pocket coils with Euro-top hybrid sleep systems',
    url: '/collections?category=mattress-beddings&type=pocket-spring',
  },
  {
    name: 'Mattress Toppers & Protectors',
    slug: 'toppers',
    typeKey: 'toppers',
    badge: 'Cloud Hotel Comfort',
    description: 'Hotel-grade baffle-box pillow tops, cooling Euro-toppers & waterproof fitted protectors',
    url: '/collections?category=mattress-beddings&type=toppers',
  },
  {
    name: 'Luxury Bedding & Platform Beds',
    slug: 'beddings',
    typeKey: 'beddings',
    badge: 'Designer Suites',
    description: 'Foldable futon mats, upholstered platform beds & luxury marble duvet suites',
    url: '/collections?category=mattress-beddings&type=beddings',
  },
  {
    name: 'Memory Foam Mattresses',
    slug: 'memory-foam',
    typeKey: 'memory-foam',
    badge: 'Pressure Relief',
    description: 'Cool-gel pressure relief & ergonomic contouring memory foam',
    url: '/collections?category=mattress-beddings&type=memory-foam',
  },
];

export const PILLOW_TYPES = [
  {
    name: 'All Pillows & Cushions',
    slug: 'all',
    typeKey: 'all',
    badge: 'Artisanal Collection',
    description: 'Complete artisanal living accent collection of sofa cushions, lumbar pillows & throws',
    url: '/collections?category=pillow-cushion',
  },
  {
    name: 'Decorative Throw Cushions',
    slug: 'throw-cushions',
    typeKey: 'throw-cushions',
    badge: 'Designer Ensembles',
    description: 'Rich velvet, linen & jacquard coordinated sofa cushion ensembles',
    url: '/collections?category=pillow-cushion&type=throw-cushions',
  },
  {
    name: 'Bouclé & Textured Accents',
    slug: 'boucle-accents',
    typeKey: 'boucle-accents',
    badge: 'Tactile Warmth',
    description: 'Cozy teddy bouclé, chunky knit throws & textured sensory accent pillows',
    url: '/collections?category=pillow-cushion&type=boucle-accents',
  },
  {
    name: 'Lumbar & Ergonomic Pillows',
    slug: 'lumbar-pillows',
    typeKey: 'lumbar-pillows',
    badge: 'Postural Comfort',
    description: 'Handwoven basketweave lumbar pillows & cervical memory foam neck pillows',
    url: '/collections?category=pillow-cushion&type=lumbar-pillows',
  },
  {
    name: 'Botanical & Embroidered Suites',
    slug: 'botanical-cushions',
    typeKey: 'botanical-cushions',
    badge: 'Nature Inspired',
    description: 'Embroidered palm leaves, botanical foliage & geometric jacquard cushion suites',
    url: '/collections?category=pillow-cushion&type=botanical-cushions',
  },
  {
    name: 'Sleeping & Bed Pillows',
    slug: 'bed-pillows',
    typeKey: 'bed-pillows',
    badge: 'Restful Sleep',
    description: 'Plush down-alternative sleeping pillow pairs & orthopedic head rests',
    url: '/collections?category=pillow-cushion&type=bed-pillows',
  },
];

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
  'mattresses': 'Mattress & Beddings',
  'mattress': 'Mattress & Beddings',
  'pillow-cushion': 'Pillow & Cushion',
  'pillow & cushion': 'Pillow & Cushion',
  'pillows-cushions': 'Pillow & Cushion',
  'pillows & cushions': 'Pillow & Cushion',
  'pillows-and-cushions': 'Pillow & Cushion',
  'cushions': 'Pillow & Cushion',
  'pillows': 'Pillow & Cushion',
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
