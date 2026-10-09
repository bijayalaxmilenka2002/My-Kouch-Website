import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Award,
  Sliders,
  MessageSquare,
  CheckCircle,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Phone,
  Armchair,
} from 'lucide-react';
import { getProductById, getImageUrl } from '../services/api';
import { useSofa } from '../context/SofaContext';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { FALLBACK_PRODUCTS } from '../data/fallbackProducts';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { openCustomizeModal } = useSofa();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [isColorTintActive, setIsColorTintActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getProductById(id);
        if (res.success && res.product) {
          setProduct(res.product);
          setRelatedProducts(res.relatedProducts || []);
          setActiveImageIndex(0);
          if (res.product.colors && res.product.colors.length > 0) {
            setSelectedColor(res.product.colors[0]);
          }
        } else {
          // Check fallback and local custom products
          let candidateList = FALLBACK_PRODUCTS;
          try {
            const localCustomRaw = localStorage.getItem('mykouch_custom_products');
            if (localCustomRaw) {
              const localCustom = JSON.parse(localCustomRaw);
              if (Array.isArray(localCustom)) candidateList = [...localCustom, ...FALLBACK_PRODUCTS];
            }
          } catch (e) {}

          const fb = candidateList.find((p) => p._id === id || p.slug === id);
          if (fb) {
            setProduct(fb);
            setRelatedProducts(candidateList.filter((p) => p._id !== fb._id && p.category === fb.category).slice(0, 4));
            setActiveImageIndex(0);
            if (fb.colors && fb.colors.length > 0) setSelectedColor(fb.colors[0]);
          } else {
            setError('Product not found');
          }
        }
      } catch (err) {
        // If API fails during Render cold-start, check fallback and custom products
        let candidateList = FALLBACK_PRODUCTS;
        try {
          const localCustomRaw = localStorage.getItem('mykouch_custom_products');
          if (localCustomRaw) {
            const localCustom = JSON.parse(localCustomRaw);
            if (Array.isArray(localCustom)) candidateList = [...localCustom, ...FALLBACK_PRODUCTS];
          }
        } catch (e) {}

        const fb = candidateList.find((p) => p._id === id || p.slug === id);
        if (fb) {
          setProduct(fb);
          setRelatedProducts(candidateList.filter((p) => p._id !== fb._id && p.category === fb.category).slice(0, 4));
          setActiveImageIndex(0);
          if (fb.colors && fb.colors.length > 0) setSelectedColor(fb.colors[0]);
        } else {
          setError(err.message || 'Error loading product details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading product craftsmanship details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--color-espresso)' }}>Product Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          The requested product could not be found in our collection catalogue.
        </p>
        <Link to="/collections" className="btn btn-primary">
          Browse All Collections
        </Link>
      </div>
    );
  }

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/assets/sofas/drawing_room_1_2.jpg'];

  const specs = product.specifications || {};

  const isBedding = product.category?.toLowerCase().includes('mattress') || product.category?.toLowerCase().includes('bedding');
  const isCushion = product.category?.toLowerCase().includes('pillow') || product.category?.toLowerCase().includes('cushion');

  const warrantyText = specs.warranty || (
    isBedding
      ? '10-Year Direct Factory Sag Warranty'
      : isCushion
      ? '2-Year Stitch & Seam Guarantee'
      : '10-Year Sal Wood Frame Warranty'
  );

  const specsTitle = isBedding
    ? 'Detailed Mattress Specifications & Sleep Science'
    : isCushion
    ? 'Detailed Cushion Specifications & Materials'
    : 'Detailed Sofa Specifications';

  const frameLabel = isBedding
    ? 'Core & Spring Architecture'
    : isCushion
    ? 'Shell & Stitching Structure'
    : 'Frame Structure';

  const foamLabel = isBedding
    ? 'Comfort & Foam Density'
    : isCushion
    ? 'Filling & Micro-Fiber Loft'
    : 'Foam & Cushioning Density';

  const suspensionLabel = isBedding
    ? 'Ticking & Quilted Cover'
    : isCushion
    ? 'Zipper & Seam Closure'
    : 'Suspension Architecture';

  const dimensionsLabel = isCushion
    ? 'Dimensions & Set Size'
    : isBedding
    ? 'Standard Dimensions'
    : 'Overall Dimensions';

  const getColorHex = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('emerald') || n.includes('teal')) return '#186455';
    if (n.includes('navy') || n.includes('blue') || n.includes('sky')) return '#1B355B';
    if (n.includes('terracotta') || n.includes('rust') || n.includes('orange')) return '#C05621';
    if (n.includes('ivory') || n.includes('cream') || n.includes('snow') || n.includes('white') || n.includes('alabaster')) return '#EDE7D9';
    if (n.includes('charcoal') || n.includes('slate') || n.includes('noir') || n.includes('black')) return '#2C353F';
    if (n.includes('grey') || n.includes('gray') || n.includes('mist')) return '#7B8491';
    if (n.includes('champagne') || n.includes('beige') || n.includes('sand') || n.includes('oatmeal')) return '#D2B48C';
    if (n.includes('taupe') || n.includes('mocha') || n.includes('brown') || n.includes('chocolate') || n.includes('coffee')) return '#5C3826';
    if (n.includes('caramel') || n.includes('tan') || n.includes('toffee') || n.includes('cognac')) return '#9E5B28';
    if (n.includes('maroon') || n.includes('bordeaux') || n.includes('wine') || n.includes('burgundy')) return '#6E1A29';
    if (n.includes('rose') || n.includes('pink') || n.includes('blush')) return '#D98282';
    if (n.includes('mustard') || n.includes('gold') || n.includes('ochre') || n.includes('yellow')) return '#C89434';
    if (n.includes('sage') || n.includes('olive') || n.includes('green') || n.includes('moss') || n.includes('mint')) return '#4E6B48';
    return '#A27B5C';
  };

  const handleColorSelect = (colorName) => {
    setSelectedColor(colorName);
    setIsColorTintActive(true);
    // Preserves the activeImageIndex so the same photograph changes color!
  };

  const handleResetColor = () => {
    setIsColorTintActive(false);
  };

  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": images.map((img) => img.startsWith('http') ? img : `https://mykouch.com${img}`),
    "description": product.description || `Handcrafted ${product.name} with premium Sal wood frame and 40D high-resilience foam.`,
    "sku": product._id || product.slug,
    "brand": {
      "@type": "Brand",
      "name": "myKouch"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://mykouch.com/product/${product._id || product.slug}`,
      "priceCurrency": "INR",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "FurnitureStore",
        "name": "myKouch Luxury Sofas Bhubaneswar"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || "4.9",
      "reviewCount": product.reviewsCount || "32"
    }
  } : null;

  return (
    <div style={{ background: '#FAF8F5', padding: '2.5rem 0 5rem' }}>
      <SEO
        title={`${product.name} • Bespoke ${product.category}`}
        description={`${product.name}: ${product.description ? product.description.slice(0, 150) : ''} Handcrafted in Bhubaneswar with 10-year Sal wood warranty.`}
        image={images[0]}
        schema={productSchema}
      />
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link> &gt;{' '}
          <Link to="/collections" style={{ color: 'var(--text-secondary)' }}>Collections</Link> &gt;{' '}
          <Link to={`/collections?category=${encodeURIComponent(product.category)}`} style={{ color: 'var(--text-secondary)' }}>
            {product.category}
          </Link> &gt;{' '}
          <span style={{ color: 'var(--color-espresso)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Product Showcase Grid */}
        <div className="product-detail-grid">
          {/* Gallery Column */}
          <div>
            {/* Main Stage Image */}
            <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: '#FFFFFF', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)', aspectRatio: '4 / 3', position: 'relative' }}>
              <img
                src={getImageUrl(images[activeImageIndex])}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'filter 0.4s ease, transform 0.4s ease',
                  filter: isColorTintActive && selectedColor ? 'contrast(1.04) saturate(1.15)' : 'none',
                }}
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
                    e.target.src = '/assets/sofas/drawing_room_1_2.jpg';
                  }
                }}
              />

              {/* Dynamic Fabric Color Overlay - Changes same image fabric color */}
              {isColorTintActive && selectedColor && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    backgroundColor: getColorHex(selectedColor),
                    mixBlendMode: 'color',
                    opacity: 0.52,
                    transition: 'background-color 0.4s ease, opacity 0.4s ease',
                  }}
                />
              )}

              {/* Dynamic Highlight Tint for rich depth */}
              {isColorTintActive && selectedColor && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    backgroundColor: getColorHex(selectedColor),
                    mixBlendMode: 'soft-light',
                    opacity: 0.28,
                    transition: 'background-color 0.4s ease',
                  }}
                />
              )}

              {/* Live Color Swatch Indicator */}
              {isColorTintActive && selectedColor && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '1rem',
                    background: 'rgba(26, 22, 20, 0.88)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                    zIndex: 2,
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  <span
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: getColorHex(selectedColor),
                      border: '1.5px solid #FFFFFF',
                      display: 'inline-block',
                      boxShadow: '0 0 4px rgba(0,0,0,0.3)',
                    }}
                  />
                  <span>Live Preview: {selectedColor}</span>
                </div>
              )}

              {product.badge && (
                <span className={`product-badge ${product.badge.toLowerCase().includes('best') ? 'bestseller' : 'new'}`} style={{ top: '1rem', left: '1rem', zIndex: 2 }}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveImageIndex(idx);
                      if (product.colors && product.colors[idx]) {
                        setSelectedColor(product.colors[idx]);
                      }
                    }}
                    style={{
                      width: '80px',
                      height: '60px',
                      flexShrink: 0,
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: activeImageIndex === idx ? '2.5px solid var(--color-primary)' : '1px solid var(--border-light)',
                      opacity: activeImageIndex === idx ? 1 : 0.7,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    title={product.colors && product.colors[idx] ? `View ${product.colors[idx]}` : `Image ${idx + 1}`}
                  >
                    <img src={getImageUrl(img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Column */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              <Sparkles size={14} />
              <span>{product.category}</span>
            </div>

            <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-serif)', color: 'var(--color-espresso-dark)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
              {product.name}
            </h1>

            {/* Seating Capacity (Only shown in Details of the Sofa) */}
            {product.seatingCapacity && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.3rem 0.85rem', background: '#F5ECE1', borderRadius: 'var(--radius-full)', color: 'var(--color-espresso)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.85rem', border: '1px solid rgba(192, 86, 33, 0.25)' }}>
                <Armchair size={15} color="var(--color-primary)" />
                <span>{isBedding ? `Size: ${product.seatingCapacity}` : isCushion ? `Configuration: ${product.seatingCapacity}` : `Seating Capacity: ${product.seatingCapacity}`}</span>
              </div>
            )}

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div className="rating-stars" style={{ display: 'flex', gap: '0.15rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#F59E0B" stroke="#F59E0B" />
                ))}
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-espresso)' }}>
                {product.rating || 4.9}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                ({product.reviewsCount || 32} Customer Reviews)
              </span>
            </div>

            {/* Pricing Box */}
            <div style={{ background: '#FFFFFF', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.75rem', display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-espresso-dark)' }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount > 0 && (
                <span style={{ background: '#DCFCE7', color: '#15803D', fontWeight: 700, fontSize: '0.82rem', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)' }}>
                  Save {product.discount}% (Factory Direct)
                </span>
              )}
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
              {product.description}
            </p>

            {/* Color Palette Options */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-espresso)' }}>
                    Available Color Themes: <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{selectedColor}</span>
                  </div>
                  {isColorTintActive && (
                    <button
                      type="button"
                      onClick={handleResetColor}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-primary)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '0.2rem 0.4rem',
                        textDecoration: 'underline',
                      }}
                    >
                      Reset to Natural Fabric
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleColorSelect(c)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.45rem 0.95rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.84rem',
                        fontWeight: selectedColor === c && isColorTintActive ? 700 : 500,
                        border: selectedColor === c && isColorTintActive ? '2px solid var(--color-primary)' : '1px solid var(--border-light)',
                        background: selectedColor === c && isColorTintActive ? 'var(--color-primary-light)' : '#FFFFFF',
                        color: selectedColor === c && isColorTintActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: getColorHex(c),
                          border: '1px solid rgba(0, 0, 0, 0.15)',
                          display: 'inline-block',
                          flexShrink: 0,
                        }}
                      />
                      <span>{c}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customization Callout Box */}
            <div style={{ background: 'var(--color-primary-light)', border: '1px solid var(--color-primary-border)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                <Sliders size={16} />
                <span>
                  {isBedding
                    ? 'Need Custom Mattress Thickness or Cot Dimensions?'
                    : isCushion
                    ? 'Need Custom Cushion Sets or Matching Accent Fabrics?'
                    : 'Need Custom Measurements or Specific Fabric?'}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                {isBedding
                  ? 'We custom-craft orthopedic mattresses to fit custom wooden cots, hydraulic bed frames, or specific firmness levels.'
                  : isCushion
                  ? 'We hand-tailor cushions in any fabric from our 100+ velvet, bouclé, and linen library to match your living room.'
                  : 'We can adjust length, depth, chaise orientation, or foam firmness to suit your room layout.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="product-action-btns">
              <button
                onClick={() => openCustomizeModal(product)}
                className="btn btn-primary btn-lg"
                style={{ flexGrow: 1 }}
              >
                <Sliders size={18} />
                <span>{isBedding || isCushion ? 'Enquire & Customize' : 'Customize & Enquire Now'}</span>
              </button>

              <a
                href={`https://wa.me/918093376990?text=${encodeURIComponent(`Hi myKouch, I am interested in ${product.name} (Price: INR ${product.price}). Please share details and delivery timeline.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg"
              >
                <MessageSquare size={18} />
                <span>WhatsApp Shopkeeper</span>
              </a>
            </div>

            {/* Trust Assurances */}
            <div className="product-trust-grid">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <ShieldCheck size={18} color="var(--color-primary)" />
                <span>{warrantyText}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <Truck size={18} color="var(--color-primary)" />
                <span>White-Glove Delivery &amp; Setup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Table Section */}
        <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-espresso)', marginBottom: '1.5rem' }}>
            {specsTitle}
          </h2>

          <div className="product-specs-grid">
            <div style={{ padding: '1rem', background: 'var(--bg-sand-light)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
                {frameLabel}
              </span>
              <p style={{ margin: '0.25rem 0 0', fontWeight: 600, color: 'var(--color-espresso)' }}>
                {specs.frameMaterial || (isBedding ? 'High-Resilience Aerodynamic HR Core with Pocket Springs' : isCushion ? 'Concealed YKK Zipper with Double-Seam Piping' : 'Treated Seasoned Sal & Marandi Hardwood')}
              </p>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-sand-light)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
                {foamLabel}
              </span>
              <p style={{ margin: '0.25rem 0 0', fontWeight: 600, color: 'var(--color-espresso)' }}>
                {specs.foamDensity || (isBedding ? '50D Visco-Elastic Cool Gel Memory Foam + 40D HR Base' : isCushion ? '100% Virgin Siliconized Micro-Down Alternative (650 GSM)' : '40-Density High Resilience Supersoft Foam')}
              </p>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-sand-light)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
                {suspensionLabel}
              </span>
              <p style={{ margin: '0.25rem 0 0', fontWeight: 600, color: 'var(--color-espresso)' }}>
                {specs.suspension || (isBedding ? 'Breathable Organic Bamboo Fabric Euro-Top Quilting' : isCushion ? 'Concealed Bottom Zipper with Anti-Burst Stitching' : 'High-Tensile Carbon Steel Zig-Zag Springs & 3" Webbing')}
              </p>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-sand-light)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
                {dimensionsLabel}
              </span>
              <p style={{ margin: '0.25rem 0 0', fontWeight: 600, color: 'var(--color-espresso)' }}>
                {product.dimensions || 'Standard (Custom sizes available)'}
              </p>
            </div>

            {product.seatingCapacity && (
              <div style={{ padding: '1rem', background: 'var(--bg-sand-light)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
                  {isBedding ? 'Mattress Size' : isCushion ? 'Configuration' : 'Sofa Seating Capacity'}
                </span>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 600, color: 'var(--color-espresso)' }}>
                  {product.seatingCapacity}
                </p>
              </div>
            )}

            <div style={{ padding: '1rem', background: 'var(--bg-sand-light)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
                Legs &amp; Base Accent
              </span>
              <p style={{ margin: '0.25rem 0 0', fontWeight: 600, color: 'var(--color-espresso)' }}>
                {specs.legs || 'Brushed Golden Electroplated Metal / Solid Wood Base'}
              </p>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-sand-light)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
                Warranty Protection
              </span>
              <p style={{ margin: '0.25rem 0 0', fontWeight: 600, color: 'var(--color-espresso)' }}>
                {specs.warranty || '10 Years Frame Warranty Against Termites & Structural Sagging'}
              </p>
            </div>
          </div>
        </div>

        {/* Related Sofas in Category */}
        {relatedProducts.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', color: 'var(--color-espresso)' }}>
                More From {product.category}
              </h2>
              <Link to={`/collections?category=${encodeURIComponent(product.category)}`} className="btn btn-outline btn-sm">
                <span>View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="products-grid">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
