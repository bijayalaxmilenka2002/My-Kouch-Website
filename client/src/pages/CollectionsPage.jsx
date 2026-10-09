import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Search, X, Sparkles, Phone, MessageSquare, ArrowRight, ShieldCheck, Armchair } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import SEO from '../components/SEO';
import { useSofa } from '../context/SofaContext';
import {
  SOFA_CATEGORIES,
  MATTRESS_TYPES,
  PILLOW_TYPES,
  SLUG_TO_CATEGORY_MAP,
} from '../constants/categories';
import { FALLBACK_PRODUCTS } from '../data/fallbackProducts';

const sofaSidebarItems = [
  { name: 'All Sofas', slug: 'all' },
  ...SOFA_CATEGORIES,
];

export default function CollectionsPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openCustomizeModal, openEnquiryModal } = useSofa();

  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(false);

  // Active query parameters
  const rawCategoryParam = slug || searchParams.get('category') || 'All';
  const activeTypeParam = searchParams.get('type') || 'all';
  const activeFilter = searchParams.get('filter') || '';

  // Determine active pillar: Sofas, Mattress & Beddings, or Pillows & Cushions
  const isBeddingPillar =
    rawCategoryParam.toLowerCase().includes('mattress') ||
    rawCategoryParam.toLowerCase().includes('bedding');

  const isPillowPillar =
    rawCategoryParam.toLowerCase().includes('pillow') ||
    rawCategoryParam.toLowerCase().includes('cushion');

  const isSofaPillar = !isBeddingPillar && !isPillowPillar;

  // Resolve active sofa category
  const resolvedSofaCategory =
    rawCategoryParam !== 'All' && rawCategoryParam !== 'all'
      ? (SLUG_TO_CATEGORY_MAP[rawCategoryParam.toLowerCase()] || rawCategoryParam)
      : 'All Sofas';

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(resolvedSofaCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Synchronize category state when route changes
  useEffect(() => {
    if (isSofaPillar) {
      setSelectedCategory(resolvedSofaCategory);
    }
  }, [rawCategoryParam, isSofaPillar, resolvedSofaCategory]);

  // Fetch & filter products strictly isolated by active pillar
  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        setLoading(true);
        let baseList = FALLBACK_PRODUCTS;

        try {
          const apiParams = { isActive: 'true' };
          if (activeFilter === 'new-arrivals') apiParams.isNewArrival = 'true';
          if (activeFilter === 'top-selling') apiParams.isTopSelling = 'true';
          const res = await getProducts(apiParams);
          if (res?.products && res.products.length > 0) {
            baseList = res.products;
          }
        } catch (e) {
          baseList = FALLBACK_PRODUCTS;
        }

        // Merge any products added/edited in owner portal
        try {
          const localCustomRaw = localStorage.getItem('mykouch_custom_products');
          if (localCustomRaw) {
            const localCustom = JSON.parse(localCustomRaw);
            if (Array.isArray(localCustom) && localCustom.length > 0) {
              baseList = localCustom.filter((p) => p.isActive !== false);
            }
          }
        } catch (e) {
          // ignore
        }

        let filtered = [];

        if (isSofaPillar) {
          // Strictly only sofas: eliminate any mattress or pillow items
          filtered = baseList.filter(
            (p) =>
              p.category !== 'Mattress & Beddings' &&
              p.category !== 'Pillow & Cushion'
          );

          if (
            selectedCategory &&
            selectedCategory !== 'All' &&
            selectedCategory !== 'All Sofas'
          ) {
            filtered = filtered.filter(
              (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
            );
          }
        } else if (isBeddingPillar) {
          // Strictly only mattresses & beddings
          filtered = baseList.filter((p) => p.category === 'Mattress & Beddings');

          if (activeTypeParam && activeTypeParam !== 'all') {
            const raw = activeTypeParam.toLowerCase();
            const term = raw.replace(/-/g, ' ');
            const singular = term.endsWith('s') ? term.slice(0, -1) : term;
            filtered = filtered.filter(
              (p) =>
                p.subType === activeTypeParam ||
                p.subType === raw ||
                p.subType === singular ||
                (p.subType && p.subType.toLowerCase().includes(singular)) ||
                (p.name && p.name.toLowerCase().includes(singular)) ||
                (p.description && p.description.toLowerCase().includes(singular))
            );
          }
        } else if (isPillowPillar) {
          // Strictly only pillows & cushions
          filtered = baseList.filter((p) => p.category === 'Pillow & Cushion');

          if (activeTypeParam && activeTypeParam !== 'all') {
            const raw = activeTypeParam.toLowerCase();
            const term = raw.replace(/-/g, ' ');
            const singular = term.endsWith('s') ? term.slice(0, -1) : term;
            filtered = filtered.filter(
              (p) =>
                p.subType === activeTypeParam ||
                p.subType === raw ||
                p.subType === singular ||
                (p.subType && p.subType.toLowerCase().includes(singular)) ||
                (p.name && p.name.toLowerCase().includes(singular)) ||
                (p.description && p.description.toLowerCase().includes(singular))
            );
          }
        }

        // Live search filter
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              (p.description && p.description.toLowerCase().includes(q)) ||
              (p.category && p.category.toLowerCase().includes(q))
          );
        }

        // Collection tag filter
        if (activeFilter === 'new-arrivals') {
          const newArr = filtered.filter((p) => p.isNewArrival);
          if (newArr.length > 0) filtered = newArr;
        } else if (activeFilter === 'top-selling') {
          const topSell = filtered.filter((p) => p.isTopSelling);
          if (topSell.length > 0) filtered = topSell;
        }

        // Sorting
        if (sortBy === 'price_asc') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_desc') {
          filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
          filtered.sort((a, b) => (b.rating || 5) - (a.rating || 5));
        }

        setProducts(filtered);
      } catch (err) {
        console.error('Error fetching collection products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionData();
  }, [
    isSofaPillar,
    isBeddingPillar,
    isPillowPillar,
    selectedCategory,
    activeTypeParam,
    searchTerm,
    sortBy,
    activeFilter,
  ]);

  // Sidebar Selection Handlers
  const handleSofaSelect = (item) => {
    setSelectedCategory(item.name);
    const newParams = {};
    if (item.slug !== 'all' && item.name !== 'All Sofas') {
      newParams.category = item.slug;
    }
    if (activeFilter) newParams.filter = activeFilter;
    setSearchParams(newParams);
  };

  const handleBeddingSelect = (item) => {
    const newParams = { category: 'mattress-beddings' };
    if (item.typeKey && item.typeKey !== 'all') {
      newParams.type = item.typeKey;
    }
    if (activeFilter) newParams.filter = activeFilter;
    setSearchParams(newParams);
  };

  const handlePillowSelect = (item) => {
    const newParams = { category: 'pillow-cushion' };
    if (item.typeKey && item.typeKey !== 'all') {
      newParams.type = item.typeKey;
    }
    if (activeFilter) newParams.filter = activeFilter;
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSortBy('newest');
    if (isSofaPillar) {
      setSelectedCategory('All Sofas');
      setSearchParams({});
    } else if (isBeddingPillar) {
      setSearchParams({ category: 'mattress-beddings' });
    } else if (isPillowPillar) {
      setSearchParams({ category: 'pillow-cushion' });
    }
  };

  // Dynamic Page Headers & Metadata
  let pageTitle = 'Luxury Sofas & Living Room Sets';
  let pageSubtitle = 'Every sofa in our collection is handcrafted with termite-treated solid Sal wood, high-density foam, and bespoke fabric tailoring in Bhubaneswar.';
  let pageTag = 'Handcrafted Sofa Workshop';

  if (isSofaPillar) {
    if (selectedCategory && selectedCategory !== 'All' && selectedCategory !== 'All Sofas') {
      pageTitle = selectedCategory;
      const catObj = SOFA_CATEGORIES.find((c) => c.name === selectedCategory);
      if (catObj?.description) pageSubtitle = catObj.description;
      pageTag = catObj?.badge || 'Sofa Collection';
    }
  } else if (isBeddingPillar) {
    const activeObj = MATTRESS_TYPES.find((t) => t.typeKey === activeTypeParam);
    pageTitle = activeObj && activeObj.typeKey !== 'all' ? activeObj.name : 'Luxury Mattresses & Beddings';
    pageSubtitle = activeObj?.description || 'Custom orthopedic memory foam mattresses, pocketed spring sleep systems, and hotel-grade beddings engineered for deep restorative sleep.';
    pageTag = activeObj?.badge || 'Restful Luxury';
  } else if (isPillowPillar) {
    const activeObj = PILLOW_TYPES.find((t) => t.typeKey === activeTypeParam);
    pageTitle = activeObj && activeObj.typeKey !== 'all' ? activeObj.name : 'Designer Pillows & Cushions';
    pageSubtitle = activeObj?.description || 'Handcrafted decorative sofa throw cushions, memory-foam neck pillows, and bouclé accent pads tailored for bespoke living comfort.';
    pageTag = activeObj?.badge || 'Plush Accents';
  }

  if (activeFilter === 'new-arrivals') {
    pageTitle = `${pageTitle} • New Arrivals`;
    pageTag = 'Fresh Off The Workshop Floor';
  } else if (activeFilter === 'top-selling') {
    pageTitle = `${pageTitle} • Top Selling`;
    pageTag = 'Customer Favorites';
  }

  // Active filter chip determination
  const hasActiveFilterChip =
    activeFilter ||
    (isSofaPillar && selectedCategory !== 'All' && selectedCategory !== 'All Sofas') ||
    (isBeddingPillar && activeTypeParam !== 'all') ||
    (isPillowPillar && activeTypeParam !== 'all') ||
    searchTerm.trim() !== '';

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
          {isSofaPillar ? (
            <>
              <Link to="/collections" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Sofas</Link>
              {selectedCategory !== 'All' && selectedCategory !== 'All Sofas' && (
                <>
                  <span>/</span>
                  <span style={{ color: 'var(--color-espresso)', fontWeight: 600 }}>{selectedCategory}</span>
                </>
              )}
            </>
          ) : isBeddingPillar ? (
            <>
              <Link to="/collections?category=mattress-beddings" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Mattress &amp; Beddings</Link>
              {activeTypeParam !== 'all' && (
                <>
                  <span>/</span>
                  <span style={{ color: 'var(--color-espresso)', fontWeight: 600 }}>{pageTitle}</span>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/collections?category=pillow-cushion" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Pillows &amp; Cushions</Link>
              {activeTypeParam !== 'all' && (
                <>
                  <span>/</span>
                  <span style={{ color: 'var(--color-espresso)', fontWeight: 600 }}>{pageTitle}</span>
                </>
              )}
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
              <span>{mobileFilterOpen ? 'Hide Categories' : 'Filter Categories'}</span>
            </button>

            {/* Search Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--bg-sand-light)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', flexGrow: 1, maxWidth: '380px' }}>
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder={isSofaPillar ? "Search sofas by model or fabric..." : isBeddingPillar ? "Search mattresses by type..." : "Search pillows & cushions..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', background: 'transparent', padding: 0, width: '100%', fontSize: '0.9rem' }}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
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
          {hasActiveFilterChip && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-light)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Filters:</span>

              {/* Sofa Category Chip */}
              {isSofaPillar && selectedCategory !== 'All' && selectedCategory !== 'All Sofas' && (
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
                  <span>Sofa: {selectedCategory}</span>
                  <button
                    onClick={() => handleSofaSelect({ name: 'All Sofas', slug: 'all' })}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', color: 'inherit' }}
                    title="Clear category"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              {/* Mattress Subtype Chip */}
              {isBeddingPillar && activeTypeParam !== 'all' && (
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
                  <span>Type: {pageTitle}</span>
                  <button
                    onClick={() => handleBeddingSelect({ typeKey: 'all' })}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', color: 'inherit' }}
                    title="Clear type"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              {/* Pillow Subtype Chip */}
              {isPillowPillar && activeTypeParam !== 'all' && (
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
                  <span>Type: {pageTitle}</span>
                  <button
                    onClick={() => handlePillowSelect({ typeKey: 'all' })}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', color: 'inherit' }}
                    title="Clear type"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              {/* Collection Filter Tag */}
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
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('filter');
                      setSearchParams(newParams);
                    }}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', color: 'inherit' }}
                    title="Clear filter"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              {/* Search Query Chip */}
              {searchTerm && (
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
                  <span>Keyword: "{searchTerm}"</span>
                  <button
                    onClick={() => setSearchTerm('')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', color: 'inherit' }}
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

        {/* Main Grid with Dedicated Pillar Sidebar */}
        <div className="catalog-main-layout">
          {/* Desktop & Collapsible Mobile Filter Sidebar */}
          <aside className={`catalog-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--color-espresso)' }}>
                <SlidersHorizontal size={18} color="var(--color-primary)" />
                <span>
                  {isSofaPillar ? 'Sofa Categories' : isBeddingPillar ? 'Mattress Types' : 'Pillow Types'}
                </span>
              </div>
              <button
                onClick={clearAllFilters}
                style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Reset
              </button>
            </div>

            {/* Category Navigation (STRICTLY SEGREGATED BY PILLAR) */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="catalog-category-list">
                {isSofaPillar &&
                  sofaSidebarItems.map((cat) => {
                    const isSelected =
                      cat.slug === 'all'
                        ? selectedCategory === 'All' || selectedCategory === 'All Sofas'
                        : selectedCategory === cat.name;

                    return (
                      <button
                        key={cat.slug}
                        onClick={() => handleSofaSelect(cat)}
                        className={`catalog-category-btn ${isSelected ? 'active' : ''}`}
                        aria-pressed={isSelected}
                      >
                        <span className="catalog-category-name">{cat.name}</span>
                      </button>
                    );
                  })}

                {isBeddingPillar &&
                  MATTRESS_TYPES.map((type) => {
                    const isSelected =
                      (type.typeKey === 'all' && activeTypeParam === 'all') ||
                      type.typeKey === activeTypeParam;

                    return (
                      <button
                        key={type.typeKey}
                        onClick={() => handleBeddingSelect(type)}
                        className={`catalog-category-btn ${isSelected ? 'active' : ''}`}
                        aria-pressed={isSelected}
                      >
                        <span className="catalog-category-name">{type.name}</span>
                      </button>
                    );
                  })}

                {isPillowPillar &&
                  PILLOW_TYPES.map((type) => {
                    const isSelected =
                      (type.typeKey === 'all' && activeTypeParam === 'all') ||
                      type.typeKey === activeTypeParam;

                    return (
                      <button
                        key={type.typeKey}
                        onClick={() => handlePillowSelect(type)}
                        className={`catalog-category-btn ${isSelected ? 'active' : ''}`}
                        aria-pressed={isSelected}
                      >
                        <span className="catalog-category-name">{type.name}</span>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Quick Factory Info Badge (NO SEATING CAPACITY CARD) */}
            <div style={{ background: 'var(--bg-sand-light)', padding: '1.1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-espresso)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <ShieldCheck size={16} color="var(--color-primary)" />
                <span>Factory Direct Warranty</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                {isSofaPillar
                  ? 'All sofas are handcrafted in Bhubaneswar with 10-year seasoned Sal wood frame warranty and 100+ bespoke fabric choices.'
                  : isBeddingPillar
                  ? 'Every mattress is built with zero-sag guarantee, orthopedic support cores, and custom cot sizing.'
                  : 'All cushions and pillows are tailored with hypoallergenic fillings, heavy-duty zippers, and designer fabrics.'}
              </p>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Showing <strong>{products.length}</strong> items in <em>{pageTitle}</em>
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem', background: '#FFFFFF', borderRadius: 'var(--radius-md)' }}>
                <p style={{ color: 'var(--text-muted)' }}>Loading collection catalogue...</p>
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-espresso)' }}>
                  No products matched your selected filters
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Try selecting a different type or clearing your search term to view more models.
                </p>
                <button onClick={clearAllFilters} className="btn btn-outline">
                  Reset Filters
                </button>
              </div>
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
