import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AutoPlayCarousel from './AutoPlayCarousel';

import { FALLBACK_PRODUCTS } from '../data/fallbackProducts';

export default function TopSellingSection({ products = [], loading = false }) {
  const sourceProducts = products && products.length > 0 ? products : FALLBACK_PRODUCTS;

  // Intermix top-selling sofas, mattresses, and pillows into a holistic home comfort showcase
  const topSofas = sourceProducts.filter((p) => p.category?.includes('Sofa') && (p.isTopSelling || p.rating >= 4.8));
  const topMattresses = sourceProducts.filter((p) => p.category === 'Mattress & Beddings');
  const topCushions = sourceProducts.filter((p) => p.category === 'Pillow & Cushion');

  const intermixed = [];
  const maxLen = Math.max(topSofas.length, topMattresses.length, topCushions.length);
  for (let i = 0; i < maxLen; i++) {
    if (topSofas[i]) intermixed.push(topSofas[i]);
    if (topMattresses[i]) intermixed.push(topMattresses[i]);
    if (topCushions[i]) intermixed.push(topCushions[i]);
  }

  const displayItems = intermixed.length > 0 ? intermixed : sourceProducts.slice(0, 8);

  return (
    <section className="section-padding" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <div className="section-header-split reveal-on-scroll">
          <div className="section-header-split-text">
            <span className="section-tag">
              <Sparkles size={14} />
              <span>Customer Favorites</span>
            </span>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Top Selling Products</h2>
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
            products={displayItems}
            loading={loading && displayItems.length === 0}
            emptyMessage="Loading top-selling home comfort designs..."
            intervalTime={3200}
            ariaLabel="Top Selling Products Showcase"
          />
        </div>
      </div>
    </section>
  );
}
