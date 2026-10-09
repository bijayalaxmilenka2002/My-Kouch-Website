import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getImageUrl } from '../services/api';

export default function LuxuryImageCard({ product }) {
  const displayImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : '/assets/sofas/drawing_room_1_2.jpg';

  const productLink = `/product/${product._id || product.slug}`;

  return (
    <Link
      to={productLink}
      className="luxury-image-card"
      title={`Explore ${product.name}`}
    >
      <div className="luxury-image-card-wrap">
        <img
          src={getImageUrl(displayImage)}
          alt={product.name}
          className="luxury-image-card-img"
          loading="lazy"
          onError={(e) => {
            if (!e.target.dataset.fallback) {
              e.target.dataset.fallback = 'true';
              e.target.src = '/assets/sofas/drawing_room_1_12.jpg';
            }
          }}
        />

        <div className="luxury-image-card-scrim">
          <div className="luxury-image-card-content">
            {product.category && (
              <span className="luxury-image-card-category">
                {product.category.toLowerCase().includes('mattress')
                  ? 'MATTRESSES & BEDDINGS'
                  : product.category.toLowerCase().includes('pillow') || product.category.toLowerCase().includes('cushion')
                  ? 'PILLOWS & CUSHIONS'
                  : product.category.toUpperCase()}
              </span>
            )}
            <h3 className="luxury-image-card-title">{product.name}</h3>
            <span className="luxury-image-card-link">
              <span>Explore Product</span>
              <ArrowRight size={15} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
