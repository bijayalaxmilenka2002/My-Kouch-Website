import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sliders, ShieldCheck, Sparkles, Home } from 'lucide-react';
import { useSofa } from '../context/SofaContext';

export default function Hero() {
  const { openCustomizeModal } = useSofa();

  return (
    <section className="hero-cover-section">
      {/* Full Cover Background Image */}
      <div className="hero-cover-bg" />

      {/* Ambient Lighting & Contrast Scrim */}
      <div className="hero-cover-scrim" />

      <div className="container hero-cover-container">
        {/* Floating Centered Pure Text (NO CARD, NO WHITE BACKGROUND) */}
        <div className="hero-pure-text-wrap">
          {/* Category Pillar Breadcrumb */}
          <div className="hero-designer-tag">
            <span>SOFAS</span>
            <span className="sep">|</span>
            <span>MATTRESSES</span>
            <span className="sep">|</span>
            <span>PILLOWS</span>
          </div>

          {/* Main Headline (Designer Editorial Serif) */}
          <h1 className="hero-designer-title">
            Comfort Designed <span className="designer-italic-highlight">Around Your Home</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-designer-desc">
            Discover bespoke living room seating and premium sleep essentials. Crafted with high-resilience materials and luxury fabrics, tailored to your exact measurements.
          </p>

          {/* Action Buttons */}
          <div className="hero-designer-actions">
            <Link to="/collections" className="btn-designer-shop">
              <span>Explore All Collections</span>
              <ArrowRight size={17} />
            </Link>

            <button
              onClick={() => openCustomizeModal()}
              className="btn-designer-outline"
              type="button"
              title="Request Custom Measurements"
            >
              <Sliders size={16} />
              <span>Customize Your Comfort</span>
            </button>
          </div>

          {/* Delicate Divider */}
          <div className="hero-designer-divider" />

          {/* Bottom Trust Indicators (Matching image badges) */}
          <div className="hero-designer-badges">
            <div className="hero-designer-badge">
              <Sparkles size={16} className="badge-ico" />
              <span>Premium Quality</span>
            </div>
            <div className="hero-designer-badge">
              <ShieldCheck size={16} className="badge-ico" />
              <span>Up to 10-Year Warranty</span>
            </div>
            <div className="hero-designer-badge">
              <Home size={16} className="badge-ico" />
              <span>A Better Home Starts Here</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
