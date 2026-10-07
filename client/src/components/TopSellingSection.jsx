import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AutoPlayCarousel from './AutoPlayCarousel';

export default function TopSellingSection({ products = [], loading = false }) {
  const topSellers = products.filter((p) => p.isTopSelling || p.rating >= 4.8);

  return (
    <section className="section-padding" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <div className="section-header-split reveal-on-scroll">
          <div className="section-header-split-text">
            <span className="section-tag">
              <Sparkles size={14} />
              <span>Customer Favorites</span>
            </span>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Top Selling Sofas</h2>
          </div>
          <Link
            to="/collections?filter=top-selling"
            className="btn btn-outline btn-sm"
          >
            <span>View All Bestsellers</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="reveal-on-scroll delay-2">
          <AutoPlayCarousel
            products={topSellers}
            loading={loading}
            emptyMessage="Loading top-selling sofa designs..."
            intervalTime={3200}
            ariaLabel="Top Selling Sofas Showcase"
          />
        </div>
      </div>
    </section>
  );
}
