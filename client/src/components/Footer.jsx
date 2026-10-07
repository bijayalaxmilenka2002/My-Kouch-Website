import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Sliders,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { useSofa } from '../context/SofaContext';

export default function Footer() {
  const { openCustomizeModal } = useSofa();
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
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div>
            <img
              src="/assets/logo/logo_white.png"
              alt="myKouch - Comfort That Feels Like Home"
              className="footer-logo"
            />
            <p className="footer-brand-desc">
              <strong>myKouch</strong> by MB Maaarketing is Odisha's premier sofa manufacturer. We handcraft luxury L-shaped sectionals, 3+1+1 living room suites, and motorized recliners with seasoned hardwood and cloud-soft foam.
            </p>

            <div className="footer-social-row">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"></polygon>
                </svg>
              </a>
            </div>
          </div>

          {/* Sofa Collections */}
          <div>
            <h4 className="footer-heading">Sofa Collections</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item">
                <Link to="/collections?category=L-Shaped Sofas">L-Shaped Sofas</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/collections?category=Sofa Combos">Sofa Combos (3+1+1)</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/collections?category=3 Seater Sofas">3-Seater Sofas</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/collections?category=Recliner Sofas">Motorized Recliners</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/collections?category=2 Seater Sofas">2-Seater Studio Sofas</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/collections">Browse All Sofas</Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Services */}
          <div>
            <h4 className="footer-heading">Services &amp; Brand</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item">
                <Link to="/collections?filter=new-arrivals">New Arrivals</Link>
              </li>
              <li className="footer-link-item">
                <a href="/#offers" onClick={handleNavigateToOffers}>Active Offers</a>
              </li>
              <li className="footer-link-item">
                <button
                  onClick={() => openCustomizeModal()}
                  style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Sliders size={14} /> Customize Your Sofa
                </button>
              </li>
              <li className="footer-link-item">
                <Link to="/about">About myKouch</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/contact">Factory &amp; Showroom</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/contact?type=dealership">Become a Dealer</Link>
              </li>
            </ul>
          </div>

          {/* Showroom & Factory Contacts */}
          <div>
            <h4 className="footer-heading">Showroom &amp; Factory</h4>

            <div className="footer-contact-item">
              <MapPin size={18} />
              <div>
                <strong>Shop &amp; Showroom:</strong>
                <br />
                MB Maaarketing, AM42, Bhimatangi, Near Amabus Stop, Bhubaneswar, Odisha - 751002
              </div>
            </div>

            <div className="footer-contact-item">
              <MapPin size={18} />
              <div>
                <strong>Manufacturing Factory:</strong>
                <br />
                Plot No- 401, Jagannath Bihar, Sunderipada, Near Champati Petrol Pump, Bhubaneswar - 751002
              </div>
            </div>

            <div className="footer-contact-item">
              <Phone size={18} />
              <div>
                <a href="tel:+918093376990" style={{ color: '#FFFFFF', fontWeight: 700 }}>
                  +91 80933 76990
                </a>
              </div>
            </div>

            <div className="footer-contact-item">
              <Mail size={18} />
              <div>
                <a href="mailto:mykouchteam@gmail.com" style={{ color: '#D3C6B9' }}>
                  mykouchteam@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} <strong>myKouch</strong> (MB Maaarketing). All rights reserved. Comfort That Feels Like Home.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>Solid Sal Wood • 10-Year Frame Warranty</span>
            <Link
              to="/owner/login"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#8E837A', fontSize: '0.78rem' }}
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
