import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

// 4 core customer category cards: Sofas, Combos/Recliners, Mattresses, and Cushions
const homeCategories = [
  {
    name: 'L-Shaped Sofas',
    slug: 'l-shaped-sofas',
    url: '/collections?category=l-shaped-sofas',
    description: 'Expansive corner sectionals and chaise loungers engineered for ultimate living room relaxation.',
    image: '/assets/sofas/drawing_room_1_12.jpg',
    badge: 'Trending Design',
    count: '15+ Configurations',
  },
  {
    name: 'Sofa Combos & Recliners',
    slug: 'sofa-combos',
    url: '/collections?category=sofa-combos',
    description: 'Stately complete living suites and motorized zero-gravity recliners tailored for royal comfort.',
    image: '/assets/sofas/drawing_room_1_16.jpg',
    badge: 'Living Suite',
    count: '12+ Sets',
  },
  {
    name: 'Luxury Mattresses',
    slug: 'mattress-beddings',
    url: '/collections?category=mattress-beddings',
    description: 'Orthopedic memory foam mattresses and zero-motion pocketed spring systems for restorative sleep.',
    image: '/assets/mattresses/pocket_spring_hybrid_hero.jpg',
    badge: 'Doctor Recommended',
    count: 'King & Queen Sizes',
  },
  {
    name: 'Pillows & Cushions',
    slug: 'pillow-cushion',
    url: '/collections?category=pillow-cushion',
    description: 'Artisanal macramé, botanical embroidered cushions, and tactile throw suites with matching knit blankets.',
    image: '/assets/pillows/bohemian_macrame_tufted_tassel_cushion_suite.jpg',
    badge: 'Artisanal Accents',
    count: '9+ Designer Suites',
  },
];

export default function CategorySection() {
  return (
    <section className="category-section section-padding">
      <div className="container">
        <div className="section-header reveal-on-scroll">
          <span className="section-tag">
            <Sparkles size={14} />
            <span>DISCOVER BY CATEGORY</span>
          </span>
          <h2 className="section-title">Comfort For Living &amp; Sleeping Spaces</h2>
          <p className="section-subtitle">
            Explore handcrafted luxury seating, orthopedic sleep mattresses, and plush designer pillows engineered for your complete home comfort.
          </p>
        </div>

        <div className="category-grid">
          {homeCategories.map((cat, idx) => (
            <Link
              key={cat.slug}
              to={cat.url}
              className={`category-card reveal-on-scroll delay-${(idx % 4) + 1}`}
            >
              <div className="category-image-wrap">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="category-image"
                  loading="lazy"
                />
                <span className="category-count-badge">{cat.count}</span>
              </div>

              <div className="category-content">
                <h3 className="category-name" style={{ marginBottom: '0.35rem' }}>{cat.name}</h3>
                <p className="category-desc">{cat.description}</p>
                <span className="category-explore-link">
                  <span>Explore Product</span>
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
