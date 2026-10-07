import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, X, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import SEO from '../components/SEO';

const categories = [
  'All',
  'L-Shaped Sofas',
  '3 Seater Sofas',
  'Sofa Combos',
  'Recliner Sofas',
  '2 Seater Sofas',
];

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL params
  const activeFilter = searchParams.get('filter') || '';
  const urlCategory = searchParams.get('category') || 'All';

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedSeating, setSelectedSeating] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync with URL query parameter changes
  useEffect(() => {
    setSelectedCategory(urlCategory);
    if (activeFilter === 'new-arrivals') {
      setSortBy('newest');
    }
  }, [urlCategory, activeFilter]);

  useEffect(() => {
    const fetchSofaData = async () => {
      try {
        setLoading(true);
        const params = {
          isActive: 'true',
        };

        // Apply new arrivals or top selling filter from URL
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
        }
      } catch (err) {
        console.error('Error fetching collection products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSofaData();
  }, [selectedCategory, selectedSeating, searchTerm, sortBy, activeFilter]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    const newParams = {};
    if (cat !== 'All') newParams.category = cat;
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

  // Dynamic Page Header Content Based on Filter
  let pageTitle = selectedCategory === 'All' ? 'Complete Sofa Collection' : selectedCategory;
  let pageSubtitle = 'Every sofa in our collection is handcrafted with termite-treated solid Sal wood and 40-density foam. Custom dimensions and 100+ fabrics available upon request.';
  let pageTag = 'Factory-Direct Showcase';

  if (activeFilter === 'new-arrivals') {
    pageTitle = selectedCategory === 'All' ? 'New Arrivals Collection' : `New Arrivals • ${selectedCategory}`;
    pageSubtitle = 'Discover our newest handcrafted sofa silhouettes fresh off our Sunderipada factory floor. Modern aesthetics, ergonomic frames, and bespoke fabric tailoring.';
    pageTag = 'Fresh Off The Factory Floor';
  } else if (activeFilter === 'top-selling') {
    pageTitle = selectedCategory === 'All' ? 'Top Selling Sofas Collection' : `Top Selling • ${selectedCategory}`;
    pageSubtitle = 'Our highest-rated, customer-favorite living room centerpieces handcrafted for long-lasting luxury.';
    pageTag = 'Customer Favorites';
  }

  return (
    <div style={{ background: '#FAF8F5', minHeight: '80vh', padding: '2.5rem 0 5rem' }}>
      <SEO
        title={`${pageTitle} • Handcrafted Luxury Sofas`}
        description={`Explore handcrafted luxury sofas in Bhubaneswar. L-shaped sectionals, 3+1+1 living room suites, motorized recliners. 10-year Sal wood warranty, custom dimensions, and direct factory pricing.`}
      />
      <div className="container">
        {/* Page Title & Breadcrumb */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="section-tag" style={activeFilter === 'new-arrivals' ? { background: '#DCFCE7', color: '#15803D', borderColor: '#BBF7D0' } : {}}>
            <Sparkles size={14} />
            <span>{pageTag}</span>
          </span>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-espresso)', marginBottom: '0.5rem' }}>
            {pageTitle}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '680px' }}>
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
              aria-label="Toggle sofa filters"
            >
              <SlidersHorizontal size={16} />
              <span>{mobileFilterOpen ? 'Hide Filters' : 'Filter Sofas'}</span>
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
                placeholder="Search by sofa name, color, style..."
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
          {activeFilter && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-light)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Collection Filter:</span>
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
                  title="Show all collections"
                >
                  <X size={13} />
                </button>
              </span>
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
                <span>Filters</span>
              </div>
              <button
                onClick={clearAllFilters}
                style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}
              >
                Reset All
              </button>
            </div>

            {/* Categories */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-espresso)', marginBottom: '0.85rem' }}>
                Sofa Category
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    style={{
                      textAlign: 'left',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.88rem',
                      fontWeight: selectedCategory === cat ? 700 : 500,
                      background: selectedCategory === cat ? 'var(--color-primary-light)' : 'transparent',
                      color: selectedCategory === cat ? 'var(--color-primary)' : 'var(--text-secondary)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Seating Capacity */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-espresso)', marginBottom: '0.85rem' }}>
                Seating Capacity
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
          </aside>

          {/* Product Grid Area */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Showing <strong>{products.length}</strong> handcrafted sofa models
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem', background: '#FFFFFF', borderRadius: 'var(--radius-md)' }}>
                <p style={{ color: 'var(--text-muted)' }}>Loading sofa collection...</p>
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-espresso)' }}>
                  No sofas matched your selected filters
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Try changing category or clearing your search term to see more models.
                </p>
                <button onClick={clearAllFilters} className="btn btn-outline">
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
