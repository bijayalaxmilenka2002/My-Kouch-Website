import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, HeartHandshake, Sparkles, ArrowRight } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="about-section section-padding">
      <div className="container">
        <div className="about-grid">
          {/* Visual Side */}
          <div className="about-image-stack reveal-on-scroll">
            <div className="about-image-main">
              <img
                src="/assets/sofas/drawing_room_1_16.jpg"
                alt="myKouch master sofa craftsmanship"
                loading="lazy"
              />
            </div>

            <div className="about-badge-card">
              <div className="stat-num">100%</div>
              <div className="stat-text">
                100% Direct In-House Furniture &amp; Bedding Manufacturing at our Sunderipada Factory
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="about-content-block reveal-on-scroll delay-2">
            <span className="section-tag">
              <Sparkles size={14} />
              <span>About myKouch</span>
            </span>

            <h2>Crafting Comfort. Designing Lifestyle.</h2>

            <p>
              Under MB Marketing, <strong>myKouch</strong> was founded on a simple conviction: your home is where life unfolds. You shouldn't have to compromise with mass-market sizes or flimsy particle boards when seeking true comfort.
            </p>

            <p>
              From sofas framed with seasoned Sal hardwood to ergonomic pocket-spring mattresses, every piece is layered with premium materials.
            </p>

            {/* 3 Pillars from Client Company Profile */}
            <div className="about-pillars-grid">
              <div className="pillar-item">
                <div className="pillar-icon-box">
                  <ShieldCheck size={22} />
                </div>
                <div className="pillar-title">Premium Quality</div>
                <div className="pillar-desc">Premium materials with extensive warranties</div>
              </div>

              <div className="pillar-item">
                <div className="pillar-icon-box">
                  <Award size={22} />
                </div>
                <div className="pillar-title">Crafted To Perfection</div>
                <div className="pillar-desc">Custom tailored to your room dimensions</div>
              </div>

              <div className="pillar-item">
                <div className="pillar-icon-box">
                  <HeartHandshake size={22} />
                </div>
                <div className="pillar-title">Comfort For Every Home</div>
                <div className="pillar-desc">Direct factory pricing without middleman markups</div>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem' }}>
              <Link to="/about" className="btn btn-outline">
                <span>Learn Our Full Story</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
