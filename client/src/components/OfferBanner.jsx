import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Copy, Check } from 'lucide-react';

export default function OfferBanner({ offer }) {
  const [copied, setCopied] = useState(false);

  const fallbackOffer = {
    title: 'Durga Pooja Offer',
    subtitle: 'Exclusive Factory-Direct Pricing & Free Consultation',
    description: 'On Durga Pooja Celebrate With My Kouch',
    discount: 'UP TO 45% OFF',
    couponCode: 'COMFORT35',
    ctaText: 'Explore Sofa Offers',
    ctaLink: '/collections',
    image: '/assets/offers/luxury_chesterfield_offer.jpg',
    isActive: true,
  };

  const currentOffer = offer && offer.isActive ? offer : fallbackOffer;

  const handleCopyCode = () => {
    if (currentOffer.couponCode) {
      navigator.clipboard.writeText(currentOffer.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Collage images displaying client's premium sofa catalog
  const collageItems = [
    {
      src: currentOffer.image || '/assets/offers/luxury_chesterfield_offer.jpg',
      alt: 'Luxury Cognac Chesterfield',
      className: 'flash-frame-1',
    },
    {
      src: '/assets/sofas/royal_chesterfield_noir.jpg',
      alt: 'Royal Noir Tufted Sofa',
      className: 'flash-frame-2',
    },
    {
      src: '/assets/sofas/drawing_room_1_10.jpg',
      alt: 'Celestia Sky Blue Sectional',
      className: 'flash-frame-3',
    },
    {
      src: '/assets/sofas/drawing_room_1_12.jpg',
      alt: 'Tuscany Quilted L-Shaped Sofa',
      className: 'flash-frame-4',
    },
    {
      src: '/assets/sofas/drawing_room_1_11.jpg',
      alt: 'Aurelia Velvet Corner Lounger',
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
                <span>{currentOffer.ctaText || 'Check It Out'}</span>
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
