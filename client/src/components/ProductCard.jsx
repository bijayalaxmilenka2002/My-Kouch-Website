import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquare, Sliders } from 'lucide-react';
import { useSofa } from '../context/SofaContext';
import { getImageUrl } from '../services/api';

export default function ProductCard({ product }) {
  const { openCustomizeModal, openEnquiryModal } = useSofa();

  // Primary image
  const displayImage = product.images && product.images.length > 0
    ? product.images[0]
    : '/assets/sofas/drawing_room_1_2.jpg';

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="product-card">
      <div className="product-card-image-wrap">
        <Link to={`/product/${product._id || product.slug}`}>
          <img
            src={getImageUrl(displayImage)}
            alt={product.name}
            className="product-card-image"
            loading="lazy"
            onError={(e) => {
              if (!e.target.dataset.triedRelative && e.target.src.includes('/uploads/')) {
                e.target.dataset.triedRelative = 'true';
                // Try relative static path on Vercel
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
        </Link>

        {product.badge && (
          <span className={`product-badge ${product.badge.toLowerCase().includes('best') ? 'bestseller' : product.badge.toLowerCase().includes('new') ? 'new' : ''}`}>
            {product.badge}
          </span>
        )}

        {product.discount > 0 && (
          <span className="product-discount-pill">
            {product.discount}% OFF
          </span>
        )}

        {product.seatingCapacity && (
          <span className="product-capacity-tag">
            {product.seatingCapacity}
          </span>
        )}
      </div>

      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>

        <h3 className="product-card-title" title={product.name}>
          <Link to={`/product/${product._id || product.slug}`}>
            {product.name}
          </Link>
        </h3>

        <div className="product-card-rating">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                fill={i < Math.floor(product.rating || 5) ? '#F59E0B' : 'none'}
                stroke="#F59E0B"
              />
            ))}
          </div>
          <span>{product.rating || 4.9}</span>
          <span className="rating-count">({product.reviewsCount || 24} reviews)</span>
        </div>

        <div className="product-card-pricing">
          <span className="price-current">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="price-original">{formatPrice(product.originalPrice)}</span>
          )}
          {product.discount > 0 && (
            <span className="price-savings">Save {product.discount}%</span>
          )}
        </div>

        <div className="product-card-actions">
          <Link
            to={`/product/${product._id || product.slug}`}
            className="btn btn-light btn-sm"
          >
            <span>Details</span>
          </Link>
          <button
            onClick={() => openEnquiryModal(product)}
            className="btn btn-primary btn-sm"
            title="Instant Sofa Enquiry"
          >
            <MessageSquare size={13} />
            <span>Enquire</span>
          </button>
        </div>
      </div>
    </div>
  );
}
