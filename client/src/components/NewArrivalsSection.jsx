import React, { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Sparkles, ArrowRight } from 'lucide-react';
import { useSofa } from '../context/SofaContext';
import { getImageUrl } from '../services/api';
import { FALLBACK_PRODUCTS } from '../data/fallbackProducts';

export default function NewArrivalsSection({ products = [], loading = false }) {
  const { openCustomizeModal } = useSofa();
  const [activeSubTab, setActiveSubTab] = useState('All Products');
  const scrollRef = useRef(null);

  // Filter products marked as isNewArrival
  const newArrivals = useMemo(() => {
    const list = products && products.length > 0 ? products : FALLBACK_PRODUCTS;
    return list.filter((p) => p.isNewArrival === true && p.isActive !== false);
  }, [products]);

  // Comprehensive home comfort category tabs
  const subCategoryTabs = [
    'All Products',
    'Luxury Sofas',
    'Mattresses & Beddings',
    'Pillows & Cushions',
    'Living Room Sets',
  ];

  // Filter arrivals by active subcategory tab
  const filteredArrivals = useMemo(() => {
    if (activeSubTab === 'All Products') return newArrivals;
    if (activeSubTab === 'Luxury Sofas') {
      return newArrivals.filter((p) =>
        (p.category || '').toLowerCase().includes('sofa') ||
        (p.category || '').toLowerCase().includes('recliner')
      );
    }
    if (activeSubTab === 'Mattresses & Beddings') {
      return newArrivals.filter((p) =>
        (p.category || '').toLowerCase().includes('mattress') ||
        (p.category || '').toLowerCase().includes('bedding')
      );
    }
    if (activeSubTab === 'Pillows & Cushions') {
      return newArrivals.filter((p) =>
        (p.category || '').toLowerCase().includes('pillow') ||
        (p.category || '').toLowerCase().includes('cushion')
      );
    }
    if (activeSubTab === 'Living Room Sets') {
      return newArrivals.filter((p) =>
        p.category === 'Sofa Combos' ||
        p.category === 'L-Shaped Sofas' ||
        (p.name || '').toLowerCase().includes('suite') ||
        (p.name || '').toLowerCase().includes('set')
      );
    }
    return newArrivals;
  }, [newArrivals, activeSubTab]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="new-arrivals" className="wakefit-arrivals-section section-padding">
      <div className="container">
        {/* Wakefit Header Banner Canvas */}
        <div className="wakefit-arrivals-banner">
          {/* Faded lifestyle backdrop image on right (matching Wakefit) */}
          <img
            src="/assets/sofas/drawing_room_1_10.jpg"
            alt="Living room backdrop"
            className="wakefit-banner-bg-img"
          />

          <div className="wakefit-banner-content">
            <div className="wakefit-top-row">
              <div>
                {/* 3D "NEW" Typography Badge */}
                <div className="wakefit-title-wrap">
                  <span className="wakefit-new-3d" aria-label="NEW">
                    <span className="wakefit-3d-letter">N</span>
                    <span className="wakefit-3d-letter">E</span>
                    <span className="wakefit-3d-letter">W</span>
                  </span>
                  <span className="wakefit-title-text">Arrivals</span>
                </div>

                {/* Subtitle */}
                <p className="wakefit-subtitle">
                  Be the first to explore our newest furniture and home essentials, crafted for modern homes.
                </p>
              </div>
            </div>

            {/* Floating Horizontal Subcategory White Capsule Nav Bar */}
            <div className="wakefit-capsule-nav-wrap">
              <div className="wakefit-capsule-bar" role="tablist">
                {subCategoryTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeSubTab === tab}
                    className={`wakefit-capsule-item ${activeSubTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveSubTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Showcase or Empty State */}
        {newArrivals.length === 0 && !loading ? (
          /* Empty State if no arrivals pushed by owner */
          <div className="wakefit-empty-box reveal-on-scroll">
            <div className="wakefit-empty-icon">
              <Sparkles size={28} />
            </div>
            <h3 className="wakefit-empty-title">Oops! Sorry, No Products Found</h3>
            <p className="wakefit-empty-text">
              We couldn&apos;t find any new arrivals at the moment. All current workshop collections are allocated. Our artisans in Bhubaneswar are actively preparing the next batch — check back soon, or customize your dream couch directly from our workshop!
            </p>
            <div className="wakefit-empty-actions">
              <button
                type="button"
                onClick={() => openCustomizeModal()}
                className="btn btn-primary btn-sm"
              >
                <span>Request Custom Sizing &amp; Design</span>
                <ArrowRight size={15} />
              </button>
              <Link to="/collections" className="btn btn-outline btn-sm">
                <span>Browse Full Catalog</span>
              </Link>
            </div>
          </div>
        ) : filteredArrivals.length === 0 && !loading ? (
          /* Empty state for a specific subcategory when no product is available */
          <div className="wakefit-empty-box reveal-on-scroll">
            <div className="wakefit-empty-icon">
              <Sparkles size={28} />
            </div>
            <h3 className="wakefit-empty-title">
              Oops! Sorry, No Products Found in &ldquo;{activeSubTab}&rdquo;
            </h3>
            <p className="wakefit-empty-text">
              We couldn&apos;t find any new arrivals in this section right now. Our workshop is handcrafting fresh models every week — browse &ldquo;All Products&rdquo; to see our latest drops or request a custom build tailored to your space!
            </p>
            <div className="wakefit-empty-actions">
              <button
                type="button"
                onClick={() => setActiveSubTab('All Products')}
                className="btn btn-primary btn-sm"
              >
                <span>View All Products</span>
                <ArrowRight size={15} />
              </button>
              <button
                type="button"
                onClick={() => openCustomizeModal()}
                className="btn btn-outline btn-sm"
              >
                <span>Customize This Style</span>
              </button>
            </div>
          </div>
        ) : (
          /* Horizontal Showcase Carousel / Cards Row */
          <div className="wakefit-showcase-wrap">
            {/* Scroll Navigation Arrows */}
            {filteredArrivals.length > 3 && (
              <button
                type="button"
                className="wakefit-nav-arrow btn-prev hide-mobile"
                onClick={() => handleScroll('prev')}
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <div className="wakefit-cards-row" ref={scrollRef}>
              {filteredArrivals.map((prod) => {
                const imgUrl =
                  prod.images && prod.images.length > 0
                    ? prod.images[0]
                    : '/assets/sofas/royal_chesterfield_noir.jpg';

                const discountPercent =
                  prod.originalPrice && prod.originalPrice > prod.price
                    ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
                    : null;

                return (
                  <Link
                    key={prod._id || prod.slug}
                    to={`/product/${prod._id || prod.slug}`}
                    className="wakefit-card"
                    title={`View ${prod.name}`}
                  >
                    <div className="wakefit-card-img-wrap">
                      <img
                        src={getImageUrl(imgUrl)}
                        alt={prod.name}
                        className="wakefit-card-img"
                        loading="lazy"
                        onError={(e) => {
                          if (!e.target.dataset.triedRelative && e.target.src.includes('/uploads/')) {
                            e.target.dataset.triedRelative = 'true';
                            const parts = e.target.src.split('/uploads/');
                            if (parts[1]) {
                              e.target.src = `/uploads/${parts[1]}`;
                              return;
                            }
                          }
                          if (!e.target.dataset.failed) {
                            e.target.dataset.failed = 'true';
                            e.target.src = '/assets/sofas/royal_chesterfield_noir.jpg';
                          }
                        }}
                      />
                      <span className="wakefit-card-tag">
                        {prod.badge || 'New Launch'}
                      </span>
                    </div>

                    <div className="wakefit-card-info">
                      <span className="wakefit-card-category">
                        {prod.category} {prod.seatingCapacity ? `• ${prod.seatingCapacity}` : ''}
                      </span>
                      <h4 className="wakefit-card-title">{prod.name}</h4>

                      <div className="wakefit-card-rating">
                        <Star size={12} fill="#B45309" color="#B45309" />
                        <span>{prod.rating || 5.0}</span>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                          ({prod.reviewsCount || 12})
                        </span>
                      </div>

                      <div className="wakefit-card-price-row">
                        <span className="wakefit-card-price">
                          ₹{prod.price?.toLocaleString('en-IN') || '62,999'}
                        </span>
                        {prod.originalPrice && (
                          <span className="wakefit-card-price-orig">
                            ₹{prod.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        {discountPercent && (
                          <span className="wakefit-card-discount">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Right circular navigation arrow button (Matching the > in reference) */}
            <button
              type="button"
              className="wakefit-nav-arrow btn-next hide-mobile"
              onClick={() => handleScroll('next')}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
