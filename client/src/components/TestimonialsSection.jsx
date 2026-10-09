import React from 'react';
import { Star, MessageSquareQuote, CheckCircle2 } from 'lucide-react';
import { FALLBACK_TESTIMONIALS } from '../data/fallbackTestimonials';

export default function TestimonialsSection({ testimonials = [] }) {
  // Always ensure 4 reviews are ready to display in a clean single line (zero blank state)
  const sourceReviews =
    testimonials && testimonials.length > 0
      ? testimonials
      : FALLBACK_TESTIMONIALS;

  // Single line layout: exactly 4 cards arranged in one horizontal row as originally designed
  const displayReviews = sourceReviews.slice(0, 4);

  return (
    <section className="testimonials-section section-padding" id="reviews">
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="section-tag">
            <MessageSquareQuote size={14} />
            <span>Customer Experiences</span>
          </span>
          <h2 className="section-title">Loved In Homes Across Odisha</h2>
          <p className="section-subtitle">
            Read authentic feedback from families who entrusted their living room comfort and custom dimensions to myKouch.
          </p>
        </div>

        {/* Single Line Reviews Row */}
        <div className="testimonials-grid">
          {displayReviews.map((t, idx) => (
            <div key={t._id || idx} className="testimonial-card">
              {/* Star Rating */}
              <div className="testimonial-stars">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} size={15} fill="#F59E0B" stroke="#F59E0B" />
                ))}
              </div>

              {/* Review Quote */}
              <p className="testimonial-quote">"{t.review}"</p>

              {/* Author & Product Info */}
              <div className="testimonial-author-box">
                <div className="author-avatar-initial">
                  {t.customerName ? t.customerName.charAt(0) : 'M'}
                </div>
                <div>
                  <div className="author-name">{t.customerName}</div>
                  <div className="author-location">{t.location || 'Bhubaneswar, Odisha'}</div>
                  {t.sofaPurchased && (
                    <div className="author-product">
                      <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '3px' }} />
                      {t.sofaPurchased}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
