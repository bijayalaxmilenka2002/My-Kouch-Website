import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Phone,
  Sliders,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useSofa } from '../context/SofaContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openCustomizeModal, openEnquiryModal } = useSofa();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigateToOffers = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname === '/') {
      const el = document.getElementById('offers');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', '/#offers');
      } else {
        setTimeout(() => {
          document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
    } else {
      navigate('/#offers');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-inner">
          <span className="badge-pill">Factory Direct</span>
          <span>
            Handcrafted Luxury Sofas • Made in Bhubaneswar
            <span className="hide-mobile"> • Custom Sizes &amp; 100+ Fabrics</span>
          </span>
          <a href="tel:+918093376990" className="announcement-link hide-mobile">
            Call +91 80933 76990
          </a>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          {/* Logo with Client Branding */}
          <Link to="/" className="nav-brand" aria-label="myKouch Home">
            <div className="nav-brand-box">
              <img
                src="/assets/logo/logo_mark.png"
                alt="myKouch"
                className="nav-logo-mark"
              />
              <span className="nav-logo-tagline">
                COMFORT THAT FEELS LIKE HOME
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link ${location.pathname === '/' && !location.hash ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/collections"
                className={`nav-link ${location.pathname === '/collections' && !location.search ? 'active' : ''}`}
              >
                All Sofas
              </Link>
            </li>
            <li>
              <Link
                to="/collections?category=L-Shaped Sofas"
                className={`nav-link ${location.search.includes('L-Shaped') ? 'active' : ''}`}
              >
                L-Shape
              </Link>
            </li>
            <li>
              <Link
                to="/collections?category=Sofa Combos"
                className={`nav-link ${location.search.includes('Combos') ? 'active' : ''}`}
              >
                Sofa Combos
              </Link>
            </li>
            <li>
              <Link
                to="/collections?category=Recliner Sofas"
                className={`nav-link ${location.search.includes('Recliner') ? 'active' : ''}`}
              >
                Recliner
              </Link>
            </li>
            <li>
              <Link
                to="/collections?filter=new-arrivals"
                className={`nav-link ${location.pathname === '/collections' && location.search.includes('new-arrivals') ? 'active' : ''}`}
              >
                New Arrivals
              </Link>
            </li>
            <li>
              <a
                href="/#offers"
                onClick={handleNavigateToOffers}
                className={`nav-link ${location.hash === '#offers' ? 'active' : ''}`}
              >
                Offers
              </a>
            </li>
            <li>
              <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
                Contact
              </Link>
            </li>
          </ul>

          {/* Actions: Customize Button + Enquire CTA */}
          <div className="nav-actions">
            <button
              onClick={() => openCustomizeModal()}
              className="btn-custom-sofa"
              title="Request Custom Dimensions or Fabric"
            >
              <Sliders size={15} />
              <span>Customize</span>
            </button>

            <button
              onClick={() => openEnquiryModal()}
              className="btn-enquire-nav"
              title="Connect with shopkeeper"
            >
              <MessageSquare size={15} />
              <span>Enquire</span>
            </button>

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Backdrop & Drawer */}
      <div
        className={`mobile-drawer-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <div className="nav-brand-box" style={{ alignItems: 'flex-start' }}>
            <img
              src="/assets/logo/logo_mark.png"
              alt="myKouch"
              className="nav-logo-mark"
              style={{ height: '32px' }}
            />
            <span className="nav-logo-tagline" style={{ fontSize: '0.52rem' }}>
              COMFORT THAT FEELS LIKE HOME
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close Navigation"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--bg-sand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-espresso)',
              flexShrink: 0,
            }}
          >
            <X size={20} />
          </button>
        </div>

        <ul className="mobile-nav-links">
          <li>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/collections" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              All Sofas
            </Link>
          </li>
          <li>
            <Link to="/collections?category=L-Shaped Sofas" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              L-Shape Sofas
            </Link>
          </li>
          <li>
            <Link to="/collections?category=Sofa Combos" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              Sofa Combos (3+1+1)
            </Link>
          </li>
          <li>
            <Link to="/collections?category=Recliner Sofas" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              Recliner Sofas
            </Link>
          </li>
          <li>
            <Link to="/collections?category=3 Seater Sofas" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              3 Seater Sofas
            </Link>
          </li>
          <li>
            <Link
              to="/collections?filter=new-arrivals"
              onClick={() => setMobileMenuOpen(false)}
              className={`mobile-nav-link ${location.pathname === '/collections' && location.search.includes('new-arrivals') ? 'active' : ''}`}
            >
              New Arrivals
            </Link>
          </li>
          <li>
            <a
              href="/#offers"
              onClick={handleNavigateToOffers}
              className={`mobile-nav-link ${location.hash === '#offers' ? 'active' : ''}`}
            >
              Promotional Offers
            </a>
          </li>
          <li>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              About myKouch
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              Contact &amp; Showroom
            </Link>
          </li>
        </ul>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openCustomizeModal();
            }}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            <Sliders size={18} />
            <span>Customize Your Sofa</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openEnquiryModal();
            }}
            className="btn btn-outline"
            style={{ width: '100%' }}
          >
            <MessageSquare size={18} />
            <span>Enquire &amp; Contact</span>
          </button>
          <a
            href="tel:+918093376990"
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            <Phone size={18} />
            <span>Call Showroom</span>
          </a>
        </div>
      </div>
    </>
  );
}
