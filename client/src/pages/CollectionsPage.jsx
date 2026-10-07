import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, X, Sparkles, Phone, MessageSquare, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import SEO from '../components/SEO';
import { useSofa } from '../context/SofaContext';
import {
  CATEGORIES,
  CATEGORY_NAMES,
  SLUG_TO_CATEGORY_MAP,
  getCategoryBySlugOrName,
} from '../constants/categories';
import { FALLBACK_PRODUCTS } from '../data/fallbackProducts';

const filterCategories = ['All', ...CATEGORY_NAMES];

const seatingCapacities = [
  'All',
  '2 Seater',
  '3 Seater',
  '5 Seater (3 + 1 + 1)',
  '5 - 6 Seater',
  '6 - 7 Seater',
  'Single Recliner',
];

export default function CollectionsPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { openCustomizeModal, openEnquiryModal } = useSofa();

  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(false);

  // Determine active category from route params (:slug) or search query (?category=)
  const rawCategoryParam = slug || searchParams.get('category') || 'All';
  const resolvedCategory = rawCategoryParam !== 'All'
    ? (SLUG_TO_CATEGORY_MAP[rawCategoryParam.toLowerCase()] || rawCategoryParam)
    : 'All';

  const activeFilter = searchParams.get('filter') || '';

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(resolvedCategory);
  const [selectedSeating, setSelectedSeating] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL params or slug changes
  useEffect(() => {
    setSelectedCategory(resolvedCategory);
    if (activeFilter === 'new-arrivals') {
      setSortBy('newest');
    }
  }, [resolvedCategory, activeFilter]);

  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        setLoading(true);
        const params = {
          isActive: 'true',
        };

        if (activeFilter === 'new-arrivals') {
          params.isNewArrival = 'true';
        } else if (activeFilter === 'top-selling') {
          params.isTopSelling = 'true';
        }

        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }

        if (selectedSeating && selectedSeating !== 'All') {
          params.seatingCapacity = selectedSeating;
        }

        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }

        if (sortBy === 'price_asc') params.sort = 'price_asc';
        if (sortBy === 'price_desc') params.sort = 'price_desc';
        if (sortBy === 'rating') params.sort = 'rating';

        const res = await getProducts(params);
        if (res?.products) {
          setProducts(res.products);
        } else if (selectedCategory && selectedCategory !== 'All') {
          // If live fetch returned nothing or error, filter fallback products
          const filteredFallback = FALLBACK_PRODUCTS.filter(
            (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
          );
          setProducts(filteredFallback);
        }
      } catch (err) {
        console.error('Error fetching collection products:', err);
        // Fallback filter
        if (selectedCategory && selectedCategory !== 'All') {
          const filteredFallback = FALLBACK_PRODUCTS.filter(
            (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
          );
          setProducts(filteredFallback);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionData();
  }, [selectedCategory, selectedSeating, searchTerm, sortBy, activeFilter]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    const newParams = {};
    if (cat !== 'All') {
      const catObj = CATEGORIES.find((c) => c.name === cat);
      newParams.category = catObj ? catObj.slug : cat;
    }
    if (activeFilter) newParams.filter = activeFilter;
    setSearchParams(newParams);
  };

  const removeFilterParam = (key) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedSeating('All');
    setSearchTerm('');
    setSortBy('newest');
    setSearchParams({});
  };

  const activeCategoryObj = getCategoryBySlugOrName(selectedCategory);

  // Dynamic Page Header Content Based on Selected Category and Filter
  let pageTitle = selectedCategory === 'All' ? 'Complete Furniture & Living Collection' : selectedCategory;
  let pageSubtitle = 'Every sofa and furniture piece in our collection is handcrafted with termite-treated solid Sal wood, high-density foam, and bespoke fabric tailoring in Bhubaneswar.';
  let pageTag = 'Factory-Direct Showcase';

  if (activeCategoryObj) {
    if (activeCategoryObj.slug === 'mattress-beddings') {
      pageTitle = 'Luxury Mattresses & Beddings';
      pageSubtitle = 'Custom orthopedic high-resilience memory foam mattresses, pocketed spring sleep systems, and hotel-grade beddings engineered for deep restorative sleep.';
      pageTag = 'Restful Luxury';
    } else if (activeCategoryObj.slug === 'pillow-cushion') {
      pageTitle = 'Designer Pillows & Cushions';
      pageSubtitle = 'Handcrafted decorative sofa throw cushions, memory-foam neck pillows, and bouclé accent pads tailored for bespoke living comfort.';
      pageTag = 'Plush Accents';
    }
  }

  if (activeFilter === 'new-arrivals') {
    pageTitle = selectedCategory === 'All' ? 'New Arrivals Collection' : `New Arrivals • ${selectedCategory}`;
    pageSubtitle = 'Discover our newest silhouettes fresh off our Bhubaneswar workshop floor. Modern aesthetics, ergonomic frames, and bespoke upholstery tailoring.';
    pageTag = 'Fresh Off The Workshop Floor';
  } else if (activeFilter === 'top-selling') {
    pageTitle = selectedCategory === 'All' ? 'Top Selling Collection' : `Top Selling • ${selectedCategory}`;
    pageSubtitle = 'Our highest-rated, customer-favorite living room centerpieces handcrafted for long-lasting comfort.';
    pageTag = 'Customer Favorites';
  }

  const isSofaCategory = selectedCategory === 'All' || selectedCategory.toLowerCase().includes('sofa');

  return (
    <div style={{ background: '#FAF8F5', minHeight: '80vh', padding: '2.5rem 0 5rem' }}>
      <SEO
        title={`${pageTitle} • Handcrafted Luxury by myKouch`}
        description={pageSubtitle}
      />
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/collections" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Collections</Link>
          {selectedCategory !== 'All' && (
            <>
              <span>/</span>
              <span style={{ color: 'var(--color-espresso)', fontWeight: 600 }}>{selectedCategory}</span>
            </>
          )}
          {activeFilter && (
            <>
              <span>/</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                {activeFilter === 'new-arrivals' ? 'New Arrivals' : 'Top Selling'}
              </span>
            </>
          )}
        </nav>

        {/* Page Title Header Block */}
        <div className="collections-header-block">
          <span className="section-tag" style={activeFilter === 'new-arrivals' ? { background: '#DCFCE7', color: '#15803D', borderColor: '#BBF7D0' } : {}}>
            <Sparkles size={14} />
            <span>{pageTag}</span>
          </span>
          <h1 className="collections-page-title">
            {pageTitle}
          </h1>
          <p className="collections-page-subtitle">
            {pageSubtitle}
          </p>
        </div>

        {/* Filter Bar & Controls */}
        <div className="catalog-controls-bar">
          <div className="catalog-controls-row">
            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              className={`catalog-mobile-filter-toggle ${mobileFilterOpen ? 'active' : ''}`}
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              aria-label="Toggle collection filters"
            >
              <SlidersHorizontal size={16} />
              <span>{mobileFilterOpen ? 'Hide Filters' : 'Filter Collections'}</span>
              {(selectedCategory !== 'All' || selectedSeating !== 'All') && (
                <span
                  style={{
                    background: 'var(--color-primary)',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}
                >
                  {(selectedCategory !== 'All' ? 1 : 0) + (selectedSeating !== 'All' ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Search Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--bg-sand-light)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', flexGrow: 1, maxWidth: '380px' }}>
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search by name, fabric, style..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', background: 'transparent', padding: 0, width: '100%', fontSize: '0.9rem' }}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} style={{ color: 'var(--text-muted)' }}>
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort By Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.88rem',
                  width: 'auto',
                  minWidth: '190px',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <option value="newest">Featured &amp; Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges */}
          {(activeFilter || selectedCategory !== 'All' || selectedSeating !== 'All') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-light)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Filters:</span>
              
              {selectedCategory !== 'All' && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary-border)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  <span>Category: {selectedCategory}</span>
                  <button
                    onClick={() => handleCategorySelect('All')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', color: 'inherit' }}
                    title="Clear category"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              {activeFilter && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: activeFilter === 'new-arrivals' ? '#DCFCE7' : 'var(--color-primary-light)',
                    color: activeFilter === 'new-arrivals' ? '#15803D' : 'var(--color-primary)',
                    border: `1px solid ${activeFilter === 'new-arrivals' ? '#BBF7D0' : 'var(--color-primary-border)'}`,
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  <span>{activeFilter === 'new-arrivals' ? '✨ New Arrivals' : '★ Top Selling'}</span>
                  <button
                    onClick={() => removeFilterParam('filter')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', color: 'inherit' }}
                    title="Clear collection filter"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              {selectedSeating !== 'All' && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'var(--bg-sand)',
                    color: 'var(--color-espresso)',
                    border: '1px solid var(--border-medium)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  <span>Seating: {selectedSeating}</span>
                  <button
                    onClick={() => setSelectedSeating('All')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', color: 'inherit' }}
                    title="Clear seating filter"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}
              >
                Reset All
              </button>
            </div>
          )}
        </div>

        {/* Main Grid with Sidebar Filter */}
        <div className="catalog-main-layout">
          {/* Desktop & Collapsible Mobile Filter Sidebar */}
          <aside className={`catalog-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--color-espresso)' }}>
                <SlidersHorizontal size={18} color="var(--color-primary)" />
                <span>Product Categories</span>
              </div>
              <button
                onClick={clearAllFilters}
                style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}
              >
                Reset
              </button>
            </div>

            {/* Categories */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-espresso)', marginBottom: '0.85rem' }}>
                All Categories
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {filterCategories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const catMeta = CATEGORIES.find((c) => c.name === cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      style={{
                        textAlign: 'left',
                        padding: '0.5rem 0.65rem',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.88rem',
                        fontWeight: isSelected ? 700 : 500,
                        background: isSelected ? 'var(--color-primary-light)' : 'transparent',
                        color: isSelected ? 'var(--color-primary)' : 'var(--text-secondary)',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{cat}</span>
                      {catMeta?.badge && (
                        <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: isSelected ? '#FFFFFF' : 'var(--bg-sand)', color: 'var(--color-primary)', fontWeight: 600 }}>
                          {catMeta.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seating Capacity (Shown for sofas) */}
            {isSofaCategory && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-espresso)', marginBottom: '0.85rem' }}>
                  Sofa Seating Capacity
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {seatingCapacities.map((seat) => (
                    <button
                      key={seat}
                      onClick={() => setSelectedSeating(seat)}
                      style={{
                        textAlign: 'left',
                        padding: '0.45rem 0.65rem',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.85rem',
                        fontWeight: selectedSeating === seat ? 700 : 500,
                        background: selectedSeating === seat ? 'var(--color-primary-light)' : 'transparent',
                        color: selectedSeating === seat ? 'var(--color-primary)' : 'var(--text-secondary)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {seat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Factory Info Badge */}
            <div style={{ background: 'var(--bg-sand-light)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-espresso)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <ShieldCheck size={16} color="var(--color-primary)" />
                <span>Factory Direct Warranty</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                Every sofa, mattress, and cushion is custom manufactured in Bhubaneswar with warranty and 100+ fabric choices.
              </p>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Showing <strong>{products.length}</strong> items in <em>{selectedCategory}</em>
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem', background: '#FFFFFF', borderRadius: 'var(--radius-md)' }}>
                <p style={{ color: 'var(--text-muted)' }}>Loading collection catalogue...</p>
              </div>
            ) : products.length === 0 ? (
              /* GRACEFUL LUXURY CATEGORY PREVIEW & EMPTY STATE */
              activeCategoryObj && (activeCategoryObj.slug === 'mattress-beddings' || activeCategoryObj.slug === 'pillow-cushion') ? (
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '320px', overflow: 'hidden' }}>
                    <img
                      src={activeCategoryObj.image}
                      alt={activeCategoryObj.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(31, 21, 16, 0.85) 0%, rgba(31, 21, 16, 0.3) 60%, transparent 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '2rem',
                        color: '#FFFFFF',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          background: 'rgba(200, 98, 40, 0.9)',
                          color: '#FFFFFF',
                          padding: '0.3rem 0.85rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          width: 'fit-content',
                          marginBottom: '0.75rem',
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        <Sparkles size={13} />
                        <span>Bespoke Collection • Launching Soon</span>
                      </span>
                      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: 0, color: '#FFFFFF', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        {activeCategoryObj.name}
                      </h2>
                      <p style={{ fontSize: '0.95rem', color: '#F3EDE2', margin: '0.5rem 0 0', maxWidth: '650px' }}>
                        {activeCategoryObj.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: '2.5rem', textAlign: 'center' }}>
                    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-espresso)', marginBottom: '0.75rem' }}>
                        Custom Dimensions &amp; Fabric Orders Available Now
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                        Our factory craftsmen are currently photographing and cataloguing our ready-stock {activeCategoryObj.name.toLowerCase()} lineup.
                        In the meantime, custom sizes (King, Queen, Custom Thickness) and 100+ velvet &amp; bouclé cushion fabrics are manufactured to order with direct factory pricing.
                      </p>

                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => openEnquiryModal({ name: `Custom ${activeCategoryObj.name}`, category: activeCategoryObj.name })}
                          className="btn btn-primary"
                        >
                          <MessageSquare size={16} />
                          <span>Enquire For Custom {activeCategoryObj.shortName}</span>
                        </button>
                        <a
                          href="tel:+918093376990"
                          className="btn btn-secondary"
                        >
                          <Phone size={16} />
                          <span>Call Workshop (+91 80933 76990)</span>
                        </a>
                        <button
                          onClick={() => handleCategorySelect('All')}
                          className="btn btn-outline"
                        >
                          <span>Explore Sofas</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-espresso)' }}>
                    No products matched your selected filters
                  </h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Try selecting a different category or clearing your search term to see more models.
                  </p>
                  <button onClick={clearAllFilters} className="btn btn-outline">
                    Reset Filters
                  </button>
                </div>
              )
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product._id || product.slug} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
