import React, { useState } from 'react';
import {
  Star,
  Quote,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Armchair,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { FALLBACK_TESTIMONIALS } from '../data/fallbackTestimonials';

export default function TestimonialsSection({ testimonials = [] }) {
  // Always ensure rich testimonials are available (zero blank state)
  const displayReviews =
    testimonials && testimonials.length > 0
      ? testimonials
      : FALLBACK_TESTIMONIALS;

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'sofas' | 'mattresses'

  const filteredReviews = displayReviews.filter((t) => {
    if (activeTab === 'sofas') {
      return !t.sofaPurchased?.toLowerCase().includes('mattress') && !t.sofaPurchased?.toLowerCase().includes('cushion');
    }
    if (activeTab === 'mattresses') {
      return (
        t.sofaPurchased?.toLowerCase().includes('mattress') ||
        t.sofaPurchased?.toLowerCase().includes('cushion') ||
        t.badge?.toLowerCase().includes('recommended')
      );
    }
    return true;
  });

  return (
    <section className="testimonials-section section-padding" id="reviews">
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="section-tag">
            <Sparkles size={14} />
            <span>VERIFIED CUSTOMER REVIEWS</span>
          </span>
          <h2 className="section-title">Loved In Homes Across Odisha</h2>
          <p className="section-subtitle">
            Authentic experiences from families and homeowners who customized their dream seating, mattresses, and bespoke living spaces with myKouch.
          </p>
        </div>

        {/* Overall Trust & Rating Bar */}
        <div className="testimonials-trust-bar">
          <div className="trust-bar-item">
            <div className="trust-rating-score">4.9 / 5.0</div>
            <div className="trust-stars-row">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#F59E0B" stroke="#F59E0B" />
              ))}
            </div>
            <span className="trust-label">Overall Customer Rating</span>
          </div>

          <div className="trust-bar-divider hide-mobile" />

          <div className="trust-bar-item">
            <div className="trust-highlight-number">500+ Homes</div>
            <span className="trust-label">Furnished Across Bhubaneswar &amp; Cuttack</span>
          </div>

          <div className="trust-bar-divider hide-mobile" />

          <div className="trust-bar-item">
            <div className="trust-badge-flex">
              <ShieldCheck size={20} color="var(--color-primary)" />
              <span className="trust-highlight-number">10-Year Warranty</span>
            </div>
            <span className="trust-label">Solid Sal Wood Frame Guarantee</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="testimonials-grid">
          {filteredReviews.map((t, idx) => (
            <div key={t._id || idx} className="testimonial-card">
              {/* Card Top: Stars & Verified Badge */}
              <div className="testimonial-card-header">
                <div className="testimonial-stars">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} size={15} fill="#F59E0B" stroke="#F59E0B" />
                  ))}
                </div>
                <div className="testimonial-verified-badge">
                  <CheckCircle2 size={13} />
                  <span>{t.badge || 'Verified Owner'}</span>
                </div>
              </div>

              {/* Decorative Quote Icon */}
              <div className="testimonial-quote-wrap">
                <Quote size={24} className="testimonial-quote-icon" />
                <p className="testimonial-quote">"{t.review}"</p>
              </div>

              {/* Purchased Product Tag */}
              {t.sofaPurchased && (
                <div className="testimonial-product-tag">
                  <Armchair size={13} />
                  <span>{t.sofaPurchased}</span>
                </div>
              )}

              {/* Author Info Footer */}
              <div className="testimonial-author-box">
                <div className="author-avatar-initial">
                  {t.customerName ? t.customerName.charAt(0) : 'M'}
                </div>
                <div className="author-details">
                  <div className="author-name">{t.customerName}</div>
                  <div className="author-location">
                    <MapPin size={11} style={{ display: 'inline', marginRight: '3px' }} />
                    {t.location || 'Bhubaneswar, Odisha'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Showroom Invitation Callout */}
        <div className="testimonials-showroom-callout">
          <div className="showroom-callout-text">
            <h4>Want to experience the comfort in person?</h4>
            <p>Visit our factory showroom near Bhimatangi, Bhubaneswar to try out 30+ sofa designs, feel genuine velvet swatches, and meet our master craftsmen.</p>
          </div>
          <div className="showroom-callout-actions">
            <a href="tel:+918093376990" className="btn btn-primary">
              Call Showroom Hotline
            </a>
            <a
              href="https://maps.google.com/?q=Bhimatangi+Bhubaneswar"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Get Showroom Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
