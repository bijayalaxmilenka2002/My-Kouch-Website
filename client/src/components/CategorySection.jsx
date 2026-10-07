import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';

// Show the 6 core customer categories on home showcase
const homeCategories = CATEGORIES.filter(c => c.slug !== '2-seater-sofas');

export default function CategorySection() {
  return (
    <section className="category-section section-padding">
      <div className="container">
        <div className="section-header reveal-on-scroll">
          <span className="section-tag">
            <Sparkles size={14} />
            <span>Discover by Collection</span>
          </span>
          <h2 className="section-title">Engineered For Every Living Space &amp; Bedroom</h2>
          <p className="section-subtitle">
            Explore our handcrafted luxury sofas, orthopedic mattresses, and plush designer cushions tailored to bespoke dimensions and aesthetics.
          </p>
        </div>

        <div className="category-grid">
          {homeCategories.map((cat, idx) => (
            <Link
              key={cat.slug}
              to={`/collections?category=${encodeURIComponent(cat.slug)}`}
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <h3 className="category-name">{cat.name}</h3>
                  {cat.badge && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', background: 'var(--bg-sand)', color: 'var(--color-primary)' }}>
                      {cat.badge}
                    </span>
                  )}
                </div>
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
