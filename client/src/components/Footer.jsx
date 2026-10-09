import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Sliders,
  ShieldCheck,
  Lock,
  MessageSquare,
  Sparkles,
  Clock,
  ArrowRight,
  Award,
  CheckCircle,
} from 'lucide-react';
import { useSofa } from '../context/SofaContext';

export default function Footer() {
  const { openCustomizeModal, openEnquiryModal } = useSofa();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigateToOffers = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById('offers');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', '/#offers');
      }
    } else {
      navigate('/#offers');
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Special Top VIP Showroom Feature Strip */}
        <div className="footer-vip-strip">
          <div className="footer-vip-content">
            <span className="footer-vip-badge">
              <Sparkles size={13} />
              <span>EXPERIENCE LUXURY IN PERSON</span>
            </span>
            <h3 className="footer-vip-title">
              Visit Our Factory Showroom in Bhubaneswar
            </h3>
            <p className="footer-vip-desc">
              Touch 100+ luxury fabric swatches, experience orthopedic sleep systems, or discuss custom dimensions directly with our master craftsmen.
            </p>
          </div>

          <div className="footer-vip-actions">
            <a
              href="tel:+918093376990"
              className="btn btn-primary footer-vip-btn"
            >
              <Phone size={16} />
              <span>Call +91 80933 76990</span>
            </a>
            <a
              href="https://wa.me/918093376990"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-light footer-vip-btn"
            >
              <MessageSquare size={16} />
              <span>WhatsApp Shopkeeper</span>
            </a>
            <button
              onClick={() => openCustomizeModal()}
              className="btn btn-outline footer-vip-btn"
              style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)' }}
              title="Customize Sofas, Mattresses, or Cushions"
            >
              <Sliders size={16} />
              <span>Customize &amp; Sizing</span>
            </button>
          </div>
        </div>

        {/* Main 4-Column Footer Grid */}
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-col-brand">
            <div className="footer-brand-header">
              <img
                src="/assets/logo/logo_white.png"
                alt="myKouch - Comfort That Feels Like Home"
                className="footer-logo"
              />
              <span className="footer-tagline">COMFORT THAT FEELS LIKE HOME</span>
            </div>

            <p className="footer-brand-desc">
              <strong>myKouch</strong> by <strong>MB Marketing</strong> is Odisha's premier home comfort manufacturer. We craft bespoke luxury sofas, orthopedic mattresses, and designer pillows — delivering complete home comfort directly from our factory in Bhubaneswar.
            </p>

            {/* Quality Badges Row */}
            <div className="footer-trust-pills">
              <span className="footer-trust-pill">
                <ShieldCheck size={13} />
                <span>Up to 10-Yr Warranty</span>
              </span>
              <span className="footer-trust-pill">
                <Award size={13} />
                <span>Premium Materials</span>
              </span>
              <span className="footer-trust-pill">
                <CheckCircle size={13} />
                <span>Direct Factory Price</span>
              </span>
            </div>

            <div className="footer-social-row">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn footer-social-link"
                aria-label="Instagram"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn footer-social-link"
                aria-label="Facebook"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn footer-social-link"
                aria-label="YouTube"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"></polygon>
                </svg>
              </a>
            </div>
          </div>

          {/* Collections & Categories */}
          <div className="footer-col-links">
            <h4 className="footer-heading">Collections &amp; Categories</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item">
                <Link to="/collections?category=L-Shaped Sofas">L-Shaped Sectionals</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/collections?category=Sofa Combos">Sofa Combos (3+1+1)</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/collections?category=Recliner Sofas">Motorized Recliners</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/collections?category=mattress-beddings">Mattress &amp; Beddings</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/collections?category=pillow-cushion">Pillows &amp; Cushions</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/collections" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
                  Browse All Collections →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Services */}
          <div className="footer-col-links">
            <h4 className="footer-heading">Services &amp; Brand</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item">
                <Link to="/become-a-dealer" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
                  Become a Dealer (B2B)
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/collections?category=mattress-beddings">Mattresses &amp; Beddings</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/collections?category=pillow-cushion">Pillows &amp; Cushions</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/collections?filter=new-arrivals">New Arrivals 2026</Link>
              </li>
              <li className="footer-link-item">
                <a href="/#offers" onClick={handleNavigateToOffers}>Festive Offers</a>
              </li>
              <li className="footer-link-item">
                <button
                  onClick={() => openCustomizeModal()}
                  style={{ color: 'var(--color-primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <Sliders size={14} /> Custom Dimensions
                </button>
              </li>
              <li className="footer-link-item">
                <button
                  onClick={() => openEnquiryModal()}
                  style={{ color: '#D3C6B9', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <MessageSquare size={14} /> Enquire &amp; Contact
                </button>
              </li>
              <li className="footer-link-item">
                <Link to="/about">About myKouch Story</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/contact">Showroom &amp; Workshop</Link>
              </li>
            </ul>
          </div>

          {/* Showroom & Factory Contacts in Bhubaneswar */}
          <div className="footer-col-contacts">
            <h4 className="footer-heading">Showroom &amp; Factory</h4>

            <div className="footer-location-card">
              <div className="footer-location-header">
                <MapPin size={17} color="var(--accent-gold)" />
                <strong>Shop &amp; Showroom:</strong>
              </div>
              <p className="footer-location-address">
                MB Marketing, AM42, Bhimatangi, Near Mo Bus Stop, Bhubaneswar, Odisha - 751002
              </p>
              <div className="footer-location-time">
                <Clock size={13} />
                <span>Mon – Sun: 10:00 AM – 9:00 PM</span>
              </div>
            </div>

            <div className="footer-location-card">
              <div className="footer-location-header">
                <MapPin size={17} color="var(--color-primary)" />
                <strong>Manufacturing Factory:</strong>
              </div>
              <p className="footer-location-address">
                Plot No- 401, Jagannath Bihar, Sunderipada, Near Champati Petrol Pump, Bhubaneswar, Dist. Khordha - 751002
              </p>
            </div>

            <div className="footer-direct-actions">
              <a href="tel:+918093376990" className="footer-direct-link">
                <Phone size={15} />
                <span>+91 80933 76990</span>
              </a>
              <a href="mailto:mykouchteam@gmail.com" className="footer-direct-link">
                <Mail size={15} />
                <span>mykouchteam@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="footer-bottom">
          <div className="footer-copyright-text">
            &copy; {new Date().getFullYear()} <strong>myKouch™</strong> by <strong>MB Marketing</strong>. All rights reserved. Comfort That Feels Like Home.
          </div>
          <div className="footer-bottom-badges">
            <span className="footer-bottom-tag">Handcrafted in Bhubaneswar, Odisha</span>
            <Link
              to="/owner/login"
              className="footer-owner-link"
              title="Business Administrator Access"
            >
              <Lock size={12} />
              <span>Owner Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
