import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sliders, ShieldCheck, Sparkles, Award, CheckCircle } from 'lucide-react';
import { useSofa } from '../context/SofaContext';

export default function Hero() {
  const { openCustomizeModal } = useSofa();

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Brand Copy & CTAs */}
          <div className="hero-content">
            <div className="hero-pill">
              <Sparkles size={14} />
              <span>Handcrafted Luxury • Factory-Direct in Odisha</span>
            </div>

            <h1 className="hero-headline">
              Comfort Designed Around <span className="highlight-word">Your Home.</span>
            </h1>

            <p className="hero-description">
              Discover bespoke sofas crafted with treated Sal wood frames, 40-density high-resilience foam, and imported luxury fabrics. Tailored to your exact living room measurements.
            </p>

            <div className="hero-cta-group">
              <Link to="/collections" className="btn btn-primary btn-lg">
                <span>Explore Sofa Collections</span>
                <ArrowRight size={18} />
              </Link>

              <button
                onClick={() => openCustomizeModal()}
                className="btn btn-light btn-lg"
              >
                <Sliders size={18} />
                <span>Customize Your Sofa</span>
              </button>
            </div>

            {/* Trust Guarantee Strip */}
            <div className="hero-trust-row">
              <div className="trust-item">
                <ShieldCheck size={18} />
                <span>10-Year Frame Warranty</span>
              </div>
              <div className="trust-item">
                <Award size={18} />
                <span>100+ Custom Fabric Choices</span>
              </div>
              <div className="trust-item">
                <CheckCircle size={18} />
                <span>Direct Factory Pricing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sofa-Focused Visual Centerpiece */}
          <div className="hero-visual">
            <div className="hero-image-card">
              <img
                src="/assets/sofas/drawing_room_1_2.jpg"
                alt="myKouch Emerald Luxury Velvet L-Shape Sectional Sofa"
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
