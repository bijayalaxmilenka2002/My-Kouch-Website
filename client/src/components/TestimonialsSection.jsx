import React from 'react';
import { Star, MessageSquareQuote, CheckCircle2 } from 'lucide-react';

export default function TestimonialsSection({ testimonials = [] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="testimonials-section section-padding">
      <div className="container">
        <div className="section-header reveal-on-scroll">
          <span className="section-tag">
            <MessageSquareQuote size={14} />
            <span>Customer Experiences</span>
          </span>
          <h2 className="section-title">Loved In Homes Across Odisha</h2>
          <p className="section-subtitle">
            Read authentic feedback from families who entrusted their living room comfort and custom dimensions to myKouch.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div key={t._id || idx} className={`testimonial-card reveal-on-scroll delay-${(idx % 3) + 1}`}>
              <div className="testimonial-stars">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} size={15} fill="#F59E0B" stroke="#F59E0B" />
                ))}
              </div>

              <p className="testimonial-quote">"{t.review}"</p>

              <div className="testimonial-author-box">
                <div className="author-avatar-initial">
                  {t.customerName.charAt(0)}
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
