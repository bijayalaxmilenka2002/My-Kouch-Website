import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Copy, Check } from 'lucide-react';

export default function OfferBanner({ offer }) {
  const [copied, setCopied] = useState(false);

  const fallbackOffer = {
    title: 'Durga Puja & Festive Offers',
    subtitle: 'Exclusive Factory-Direct Pricing & Free Consultation',
    description: 'Celebrate Festive Luxury with myKouch Factory Direct Sofas, Mattresses & Beddings',
    discount: 'UP TO 45% OFF',
    couponCode: 'COMFORT35',
    ctaText: 'Shop All Offers',
    ctaLink: '/collections',
    image: '/assets/offers/luxury_chesterfield_offer.jpg',
    isActive: true,
  };

  const currentOffer = offer && offer.isActive ? offer : fallbackOffer;

  const handleCopyCode = () => {
    if (currentOffer.couponCode) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(currentOffer.couponCode);
        }
      } catch (e) {
        // clipboard write error fallback
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Collage images displaying client's complete home comfort catalog
  const collageItems = [
    {
      src: currentOffer.image || '/assets/offers/luxury_chesterfield_offer.jpg',
      alt: 'Luxury Cognac Chesterfield Sofa',
      className: 'flash-frame-1',
    },
    {
      src: '/assets/mattresses/tufted_orthopedic_hybrid_mattress.jpg',
      alt: 'Imperial Tufted Orthopedic Mattress',
      className: 'flash-frame-2',
    },
    {
      src: '/assets/pillows/designer_living_throw_cushions.jpg',
      alt: 'Designer Botanical Throw Cushions',
      className: 'flash-frame-3',
    },
    {
      src: '/assets/sofas/corduroy_luxe_sofa.jpg',
      alt: 'Ribbed Corduroy Haven Sofa',
      className: 'flash-frame-4',
    },
    {
      src: '/assets/beddings/fobath_luxury_platform_bedding.jpg',
      alt: 'FOBATH Luxury Bedding Suite',
      className: 'flash-frame-5',
    },
  ];

  return (
    <section id="offers" className="offer-flash-section section-padding">
      <div className="container">
        <div className="offer-flash-ribbon">
          {/* Subtle Ambient Background Fluted Texture & Lighting */}
          <div className="flash-ribbon-flutes" />

          {/* Left Block: FLASH SALE Logo + Headline + CTA */}
          <div className="flash-left-block">
            {/* Stylized FLASH SALE Lockup with Lightning Bolt */}
            <div className="flash-sale-lockup" aria-label="FLASH SALE">
              <div className="flash-word">
                <span>F</span>
                <span className="flash-bolt-wrap">
                  <svg
                    className="flash-bolt-svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </span>
                <span>ASH</span>
              </div>
              <div className="sale-word">SALE</div>
            </div>

            {/* Vertical Hairline Divider */}
            <div className="flash-divider-line" />

            {/* Headline and Action */}
            <div className="flash-copy-block">
              <h2 className="flash-headline">
                {currentOffer.title || 'These deals are too good to scroll past!'}
              </h2>

              {/* Subtitle / Description if set by owner */}
              {(currentOffer.subtitle || currentOffer.description) && (
                <p className="flash-subtext" style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.9)', margin: 0, lineHeight: 1.45, maxWidth: '520px' }}>
                  {currentOffer.subtitle || currentOffer.description}
                </p>
              )}

              {currentOffer.couponCode && (
                <div className="flash-coupon-row">
                  <span className="flash-coupon-pill">
                    CODE: <strong>{currentOffer.couponCode}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flash-btn-copy"
                    title="Copy coupon code"
                  >
                    {copied ? (
                      <>
                        <Check size={12} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy
                      </>
                    )}
                  </button>
                  {currentOffer.discount && (
                    <span className="flash-discount-badge">{currentOffer.discount}</span>
                  )}
                </div>
              )}

              <Link
                to={currentOffer.ctaLink || '/collections'}
                className="btn-flash-action"
              >
                <span>{currentOffer.ctaText || 'Shop All Offers'}</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Right Block: Multi-Frame Product Collage with Glowing Borders */}
          <div className="flash-collage-wrapper">
            {collageItems.map((item, idx) => (
              <Link
                key={idx}
                to={currentOffer.ctaLink || '/collections'}
                className={`flash-collage-frame ${item.className}`}
                title={item.alt}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="flash-collage-img"
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
