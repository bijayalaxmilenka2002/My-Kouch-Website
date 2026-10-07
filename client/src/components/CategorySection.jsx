import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const categories = [
  {
    name: 'L-Shaped Sofas',
    slug: 'L-Shaped Sofas',
    description: 'Expansive corner sectionals and chaise loungers engineered for ultimate living room relaxation.',
    image: '/assets/sofas/drawing_room_1_12.jpg',
    badge: 'Trending Design',
    count: '15+ Configurations',
  },
  {
    name: 'Sofa Combos (3+1+1)',
    slug: 'Sofa Combos',
    description: 'Stately complete suites pairing a 3-seater centerpiece with matching individual royal armchairs.',
    image: '/assets/sofas/drawing_room_1_16.jpg',
    badge: 'Living Room Suite',
    count: '12+ Sets',
  },
  {
    name: '3 Seater Sofas',
    slug: '3 Seater Sofas',
    description: 'Timeless architectural sofas with deep seating, fluted backrests, and modern silhouettes.',
    image: '/assets/sofas/drawing_room_1_21.jpg',
    badge: 'Popular',
    count: '20+ Styles',
  },
  {
    name: 'Recliner Sofas',
    slug: 'Recliner Sofas',
    description: 'Motorized and manual zero-gravity recliners featuring lumbar support and whisper-quiet motors.',
    image: '/assets/sofas/drawing_room_1_25.jpg',
    badge: 'Ergonomic Luxury',
    count: '8+ Models',
  },
];

export default function CategorySection() {
  return (
    <section className="category-section section-padding">
      <div className="container">
        <div className="section-header reveal-on-scroll">
          <span className="section-tag">
            <Sparkles size={14} />
            <span>Discover by Sofa Category</span>
          </span>
          <h2 className="section-title">Engineered For Every Living Space</h2>
          <p className="section-subtitle">
            Explore our handcrafted sofa categories tailored to different seating arrangements, room dimensions, and luxury aesthetics.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((cat, idx) => (
            <Link
              key={cat.name}
              to={`/collections?category=${encodeURIComponent(cat.slug)}`}
              className={`category-card reveal-on-scroll delay-${idx + 1}`}
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
                <h3 className="category-name">{cat.name}</h3>
                <p className="category-desc">{cat.description}</p>
                <span className="category-explore-link">
                  <span>Explore Series</span>
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
