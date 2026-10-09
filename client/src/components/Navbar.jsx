import React, { useState, useEffect, useRef } from 'react';
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
  ArrowRight,
  Armchair,
} from 'lucide-react';
import { useSofa } from '../context/SofaContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sofaDropdownOpen, setSofaDropdownOpen] = useState(false);
  const [mattressDropdownOpen, setMattressDropdownOpen] = useState(false);
  const [pillowDropdownOpen, setPillowDropdownOpen] = useState(false);

  const [mobileSofasOpen, setMobileSofasOpen] = useState(false);
  const [mobileMattressOpen, setMobileMattressOpen] = useState(false);
  const [mobilePillowsOpen, setMobilePillowsOpen] = useState(false);

  const sofaRef = useRef(null);
  const mattressRef = useRef(null);
  const pillowRef = useRef(null);

  const sofaTimerRef = useRef(null);
  const mattressTimerRef = useRef(null);
  const pillowTimerRef = useRef(null);

  const { openCustomizeModal, openEnquiryModal } = useSofa();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigateToOffers = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setSofaDropdownOpen(false);
    setMattressDropdownOpen(false);
    setPillowDropdownOpen(false);

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

  // Sofa Handlers
  const handleSofaMouseEnter = () => {
    if (sofaTimerRef.current) clearTimeout(sofaTimerRef.current);
    setSofaDropdownOpen(true);
  };
  const handleSofaMouseLeave = () => {
    sofaTimerRef.current = setTimeout(() => {
      setSofaDropdownOpen(false);
    }, 180);
  };
  const handleSofaClick = () => {
    navigate('/collections');
    setSofaDropdownOpen(false);
  };

  // Mattress Handlers
  const handleMattressMouseEnter = () => {
    if (mattressTimerRef.current) clearTimeout(mattressTimerRef.current);
    setMattressDropdownOpen(true);
  };
  const handleMattressMouseLeave = () => {
    mattressTimerRef.current = setTimeout(() => {
      setMattressDropdownOpen(false);
    }, 180);
  };
  const handleMattressClick = () => {
    navigate('/collections?category=mattress-beddings');
    setMattressDropdownOpen(false);
  };

  // Pillow Handlers
  const handlePillowMouseEnter = () => {
    if (pillowTimerRef.current) clearTimeout(pillowTimerRef.current);
    setPillowDropdownOpen(true);
  };
  const handlePillowMouseLeave = () => {
    pillowTimerRef.current = setTimeout(() => {
      setPillowDropdownOpen(false);
    }, 180);
  };
  const handlePillowClick = () => {
    navigate('/collections?category=pillow-cushion');
    setPillowDropdownOpen(false);
  };

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isDown = currentScrollY > lastScrollYRef.current;
      const scrollDiff = Math.abs(currentScrollY - lastScrollYRef.current);

      setIsScrolled(currentScrollY > 40);

      // 1. Top of page zone (always show static/initial navbar)
      if (currentScrollY <= 80) {
        setNavVisible(true);
      } else if (isDown && currentScrollY > 120 && scrollDiff > 5) {
        // 2. Scrolling DOWN: smoothly hide navbar to eliminate distraction
        setNavVisible(false);
        // Safely close desktop hover menus
        setSofaDropdownOpen(false);
        setMattressDropdownOpen(false);
        setPillowDropdownOpen(false);
      } else if (!isDown && scrollDiff > 5) {
        // 3. Scrolling UP: smoothly reveal luxury sticky navbar
        setNavVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on route changes
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('menu') === 'open' || params.get('drawer') === 'open') {
        setMobileMenuOpen(true);
        return;
      }
    } catch (e) {}

    setMobileMenuOpen(false);
    setSofaDropdownOpen(false);
    setMattressDropdownOpen(false);
    setPillowDropdownOpen(false);
  }, [location.pathname, location.search, location.hash]);

  // Click outside to close desktop dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sofaRef.current && !sofaRef.current.contains(e.target)) {
        setSofaDropdownOpen(false);
      }
      if (mattressRef.current && !mattressRef.current.contains(e.target)) {
        setMattressDropdownOpen(false);
      }
      if (pillowRef.current && !pillowRef.current.contains(e.target)) {
        setPillowDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Active Route Checks
  const isHomeActive = location.pathname === '/' && !location.hash;
  const isSofaActive =
    (location.pathname === '/collections' &&
      (!location.search ||
        (!location.search.toLowerCase().includes('mattress') &&
          !location.search.toLowerCase().includes('pillow') &&
          !location.search.toLowerCase().includes('cushion')))) ||
    (location.pathname.startsWith('/collections/') &&
      !location.pathname.toLowerCase().includes('mattress') &&
      !location.pathname.toLowerCase().includes('pillow'));

  const isMattressActive =
    location.search.toLowerCase().includes('mattress') ||
    location.pathname.toLowerCase().includes('mattress');

  const isPillowActive =
    location.search.toLowerCase().includes('pillow') ||
    location.search.toLowerCase().includes('cushion') ||
    location.pathname.toLowerCase().includes('pillow') ||
    location.pathname.toLowerCase().includes('cushion');

  const isOffersActive = location.hash === '#offers';
  const isDealerActive = location.pathname === '/become-a-dealer' || location.pathname === '/dealer';
  const isAboutActive = location.pathname === '/about';
  const isContactActive = location.pathname === '/contact';

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-inner">
          <span className="badge-pill">Factory Direct</span>
          <span>
            Handcrafted Luxury Sofas, Mattresses &amp; Premium Bedding • Made in Bhubaneswar • Custom Sizes &amp; 100+ Fabrics
          </span>
          <a href="tel:+918093376990" className="announcement-link hide-mobile">
            Call +91 80933 76990
          </a>
        </div>
      </div>

      {/* Main Sticky Navbar (Auto-hides on scroll down, reveals smoothly on scroll up) */}
      <header
        className={`site-header ${isScrolled ? 'scrolled' : ''} ${
          !navVisible && !mobileMenuOpen ? 'nav-hidden' : 'nav-visible'
        }`}
      >
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

          {/* Desktop Navigation Links (Uncluttered Primary Pillars) */}
          <ul className="nav-links">
            {/* 1. Home */}
            <li>
              <Link to="/" className={`nav-link ${isHomeActive ? 'active' : ''}`}>
                Home
              </Link>
            </li>

            {/* 2. All Sofas Dropdown (L-Shape, Combos, Recliners, 3-Seater, All Sofas) */}
            <li
              className="nav-item-dropdown"
              ref={sofaRef}
              onMouseEnter={handleSofaMouseEnter}
              onMouseLeave={handleSofaMouseLeave}
            >
              <button
                type="button"
                className={`nav-dropdown-trigger ${isSofaActive ? 'active' : ''}`}
                onClick={handleSofaClick}
                aria-expanded={sofaDropdownOpen}
                aria-haspopup="true"
              >
                <span>All Sofas</span>
                <ChevronDown
                  size={14}
                  className={`nav-dropdown-caret ${sofaDropdownOpen ? 'open' : ''}`}
                />
              </button>

              <div
                className={`nav-dropdown-menu ${sofaDropdownOpen ? 'is-open' : ''}`}
                role="menu"
              >
                {/* View All Sofas */}
                <Link
                  to="/collections"
                  onClick={() => setSofaDropdownOpen(false)}
                  className={`nav-dropdown-item ${location.pathname === '/collections' && !location.search ? 'active' : ''}`}
                  role="menuitem"
                >
                  <div className="nav-dropdown-icon">
                    <img src="/assets/sofas/drawing_room_1_2.jpg" alt="" />
                  </div>
                  <div className="nav-dropdown-text">
                    <span className="nav-dropdown-title">All Sofas Collection</span>
                    <span className="nav-dropdown-desc">Explore full handcrafted range</span>
                  </div>
                </Link>

                {/* L-Shape */}
                <Link
                  to="/collections?category=l-shaped-sofas"
                  onClick={() => setSofaDropdownOpen(false)}
                  className={`nav-dropdown-item ${location.search.toLowerCase().includes('l-shaped') ? 'active' : ''}`}
                  role="menuitem"
                >
                  <div className="nav-dropdown-icon">
                    <img src="/assets/sofas/drawing_room_1_12.jpg" alt="" />
                  </div>
                  <div className="nav-dropdown-text">
                    <span className="nav-dropdown-title">L-Shape Sofas</span>
                    <span className="nav-dropdown-desc">Corner sectionals &amp; loungers</span>
                  </div>
                </Link>

                {/* Combos */}
                <Link
                  to="/collections?category=sofa-combos"
                  onClick={() => setSofaDropdownOpen(false)}
                  className={`nav-dropdown-item ${location.search.toLowerCase().includes('combos') ? 'active' : ''}`}
                  role="menuitem"
                >
                  <div className="nav-dropdown-icon">
                    <img src="/assets/sofas/drawing_room_1_16.jpg" alt="" />
                  </div>
                  <div className="nav-dropdown-text">
                    <span className="nav-dropdown-title">Sofa Combos</span>
                    <span className="nav-dropdown-desc">Complete 3+1+1 living suites</span>
                  </div>
                </Link>

                {/* 3 Seater Sofas */}
                <Link
                  to="/collections?category=3-seater-sofas"
                  onClick={() => setSofaDropdownOpen(false)}
                  className={`nav-dropdown-item ${location.search.toLowerCase().includes('3-seater') ? 'active' : ''}`}
                  role="menuitem"
                >
                  <div className="nav-dropdown-icon">
                    <img src="/assets/sofas/drawing_room_1_21.jpg" alt="" />
                  </div>
                  <div className="nav-dropdown-text">
                    <span className="nav-dropdown-title">3 Seater Sofas</span>
                    <span className="nav-dropdown-desc">Architectural centerpiece couches</span>
                  </div>
                </Link>

                {/* Recliners */}
                <Link
                  to="/collections?category=recliner-sofas"
                  onClick={() => setSofaDropdownOpen(false)}
                  className={`nav-dropdown-item ${location.search.toLowerCase().includes('recliner') ? 'active' : ''}`}
                  role="menuitem"
                >
                  <div className="nav-dropdown-icon">
                    <img src="/assets/sofas/drawing_room_1_25.jpg" alt="" />
                  </div>
                  <div className="nav-dropdown-text">
                    <span className="nav-dropdown-title">Recliner Sofas</span>
                    <span className="nav-dropdown-desc">Motorized zero-gravity comfort</span>
                  </div>
                </Link>

                {/* Dropdown Footer Quick Actions */}
                <div className="nav-dropdown-footer">
                  <Link
                    to="/collections?filter=new-arrivals"
                    onClick={() => setSofaDropdownOpen(false)}
                    className="nav-dropdown-footer-link"
                  >
                    <Sparkles size={13} />
                    <span>New Arrivals 2026</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSofaDropdownOpen(false);
                      openCustomizeModal();
                    }}
                    className="nav-dropdown-footer-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <Sliders size={13} />
                    <span>Custom Sizes</span>
                  </button>
                </div>
              </div>
            </li>

            {/* 3. Mattress & Beddings Dropdown */}
            <li
              className="nav-item-dropdown"
              ref={mattressRef}
              onMouseEnter={handleMattressMouseEnter}
              onMouseLeave={handleMattressMouseLeave}
            >
              <button
                type="button"
                className={`nav-dropdown-trigger ${isMattressActive ? 'active' : ''}`}
                onClick={handleMattressClick}
                aria-expanded={mattressDropdownOpen}
                aria-haspopup="true"
              >
                <span>Mattress &amp; Beddings</span>
                <ChevronDown
                  size={14}
                  className={`nav-dropdown-caret ${mattressDropdownOpen ? 'open' : ''}`}
                />
              </button>

              <div
                className={`nav-dropdown-menu ${mattressDropdownOpen ? 'is-open' : ''}`}
                role="menu"
              >
                {/* View All Mattresses */}
                <Link
                  to="/collections?category=mattress-beddings"
                  onClick={() => setMattressDropdownOpen(false)}
                  className={`nav-dropdown-item ${location.search.toLowerCase().includes('category=mattress-beddings') && !location.search.includes('type=') ? 'active' : ''}`}
                  role="menuitem"
                >
                  <div className="nav-dropdown-icon">
                    <img src="/assets/mattresses/grand_luxury_master_bed_mattress.jpg" alt="" />
                  </div>
                  <div className="nav-dropdown-text">
                    <span className="nav-dropdown-title">All Mattresses &amp; Beddings</span>
                    <span className="nav-dropdown-desc">Complete orthopedic &amp; hotel range</span>
                  </div>
                </Link>

                {/* Orthopedic */}
                <Link
                  to="/collections?category=mattress-beddings&type=orthopedic"
                  onClick={() => setMattressDropdownOpen(false)}
                  className={`nav-dropdown-item ${location.search.includes('type=orthopedic') ? 'active' : ''}`}
                  role="menuitem"
                >
                  <div className="nav-dropdown-icon">
                    <img src="/assets/mattresses/tufted_orthopedic_hybrid_mattress.jpg" alt="" />
                  </div>
                  <div className="nav-dropdown-text">
                    <span className="nav-dropdown-title">Orthopedic Mattresses</span>
                    <span className="nav-dropdown-desc">Spine-alignment dual-comfort cores</span>
                  </div>
                </Link>

                {/* Pocket Spring */}
                <Link
                  to="/collections?category=mattress-beddings&type=pocket-spring"
                  onClick={() => setMattressDropdownOpen(false)}
                  className={`nav-dropdown-item ${location.search.includes('type=pocket-spring') ? 'active' : ''}`}
                  role="menuitem"
                >
                  <div className="nav-dropdown-icon">
                    <img src="/assets/mattresses/pocket_spring_cross_section.jpg" alt="" />
                  </div>
                  <div className="nav-dropdown-text">
                    <span className="nav-dropdown-title">Pocket Spring Mattresses</span>
                    <span className="nav-dropdown-desc">Zero-motion transfer hotel hybrid</span>
                  </div>
                </Link>

                {/* Memory Foam */}
                <Link
                  to="/collections?category=mattress-beddings&type=memory-foam"
                  onClick={() => setMattressDropdownOpen(false)}
                  className={`nav-dropdown-item ${location.search.includes('type=memory-foam') ? 'active' : ''}`}
                  role="menuitem"
                >
                  <div className="nav-dropdown-icon">
                    <img src="/assets/mattresses/pocket_spring_macro_quilt.jpg" alt="" />
                  </div>
                  <div className="nav-dropdown-text">
                    <span className="nav-dropdown-title">Memory Foam Mattresses</span>
                    <span className="nav-dropdown-desc">Cool-gel pressure relief contouring</span>
                  </div>
                </Link>

                {/* Dropdown Footer Quick Actions */}
                <div className="nav-dropdown-footer">
                  <div className="nav-dropdown-footer-link" style={{ cursor: 'default' }}>
                    <ShieldCheck size={13} />
                    <span>10-Yr Sag Warranty</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMattressDropdownOpen(false);
                      openCustomizeModal({ category: 'Mattress & Beddings' });
                    }}
                    className="nav-dropdown-footer-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <Sliders size={13} />
                    <span>Custom Cot Sizes</span>
                  </button>
                </div>
              </div>
            </li>

            {/* 4. Pillows & Cushions Dropdown */}
            <li
              className="nav-item-dropdown"
              ref={pillowRef}
              onMouseEnter={handlePillowMouseEnter}
              onMouseLeave={handlePillowMouseLeave}
            >
              <button
                type="button"
                className={`nav-dropdown-trigger ${isPillowActive ? 'active' : ''}`}
                onClick={handlePillowClick}
                aria-expanded={pillowDropdownOpen}
                aria-haspopup="true"
              >
                <span>Pillows &amp; Cushions</span>
                <ChevronDown
                  size={14}
                  className={`nav-dropdown-caret ${pillowDropdownOpen ? 'open' : ''}`}
                />
              </button>

              <div
                className={`nav-dropdown-menu ${pillowDropdownOpen ? 'is-open' : ''}`}
                role="menu"
              >
                {/* View All Pillows */}
                <Link
                  to="/collections?category=pillow-cushion"
                  onClick={() => setPillowDropdownOpen(false)}
                  className={`nav-dropdown-item ${location.search.toLowerCase().includes('category=pillow-cushion') && !location.search.includes('type=') ? 'active' : ''}`}
                  role="menuitem"
                >
                  <div className="nav-dropdown-icon">
                    <img src="/assets/pillows/bespoke_emerald_terracotta_cushion_ensemble.jpg" alt="" />
                  </div>
                  <div className="nav-dropdown-text">
                    <span className="nav-dropdown-title">All Pillows &amp; Cushions</span>
                    <span className="nav-dropdown-desc">Complete living accent collection</span>
                  </div>
                </Link>

                {/* Decorative Throw Cushions */}
                <Link
                  to="/collections?category=pillow-cushion&type=throw-cushions"
                  onClick={() => setPillowDropdownOpen(false)}
                  className={`nav-dropdown-item ${location.search.includes('type=throw-cushions') ? 'active' : ''}`}
                  role="menuitem"
                >
                  <div className="nav-dropdown-icon">
                    <img src="/assets/pillows/tuscan_terracotta_amber_botanical_cushion_suite.jpg" alt="" />
                  </div>
                  <div className="nav-dropdown-text">
                    <span className="nav-dropdown-title">Decorative Throw Cushions</span>
                    <span className="nav-dropdown-desc">Bouclé, velvet &amp; quilted accent sets</span>
                  </div>
                </Link>

                {/* Orthopedic Neck Pillows */}
                <Link
                  to="/collections?category=pillow-cushion&type=neck-pillows"
                  onClick={() => setPillowDropdownOpen(false)}
                  className={`nav-dropdown-item ${location.search.includes('type=neck-pillows') ? 'active' : ''}`}
                  role="menuitem"
                >
                  <div className="nav-dropdown-icon">
                    <img src="/assets/pillows/memory_foam_contour_hero.jpg" alt="" />
                  </div>
                  <div className="nav-dropdown-text">
                    <span className="nav-dropdown-title">Orthopedic Neck Pillows</span>
                    <span className="nav-dropdown-desc">Cervical contour memory foam</span>
                  </div>
                </Link>

                {/* Sleeping & Bed Pillows */}
                <Link
                  to="/collections?category=pillow-cushion&type=bed-pillows"
                  onClick={() => setPillowDropdownOpen(false)}
                  className={`nav-dropdown-item ${location.search.includes('type=bed-pillows') ? 'active' : ''}`}
                  role="menuitem"
                >
                  <div className="nav-dropdown-icon">
                    <img src="/assets/pillows/memory_foam_cover_closeup.jpg" alt="" />
                  </div>
                  <div className="nav-dropdown-text">
                    <span className="nav-dropdown-title">Sleeping &amp; Bed Pillows</span>
                    <span className="nav-dropdown-desc">Hotel plush down-alternative pairs</span>
                  </div>
                </Link>

                {/* Dropdown Footer Quick Actions */}
                <div className="nav-dropdown-footer">
                  <div className="nav-dropdown-footer-link" style={{ cursor: 'default' }}>
                    <Sparkles size={13} />
                    <span>100+ Designer Fabrics</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPillowDropdownOpen(false);
                      openEnquiryModal({ name: 'Custom Cushion Fabrics', category: 'Pillow & Cushion' });
                    }}
                    className="nav-dropdown-footer-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <MessageSquare size={13} />
                    <span>Fabric Advice</span>
                  </button>
                </div>
              </div>
            </li>

            {/* 5. Offers */}
            <li>
              <a
                href="/#offers"
                onClick={handleNavigateToOffers}
                className={`nav-link ${isOffersActive ? 'active' : ''}`}
              >
                Offers
              </a>
            </li>

            {/* 6. Become a Dealer */}
            <li>
              <Link
                to="/become-a-dealer"
                className={`nav-link ${isDealerActive ? 'active' : ''}`}
              >
                <span className="nav-text-full">Become a Dealer</span>
                <span className="nav-text-short">Dealers</span>
              </Link>
            </li>

            {/* 7. About Us */}
            <li>
              <Link
                to="/about"
                className={`nav-link ${isAboutActive ? 'active' : ''}`}
              >
                About Us
              </Link>
            </li>

            {/* 8. Contact Us */}
            <li>
              <Link
                to="/contact"
                className={`nav-link ${isContactActive ? 'active' : ''}`}
              >
                Contact Us
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

        {/* Mobile Navigation Links */}
        <ul className="mobile-nav-links">
          {/* Home */}
          <li>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              Home
            </Link>
          </li>

          {/* Sofas Expandable Group */}
          <li>
            <button
              type="button"
              className="mobile-accordion-header"
              onClick={() => setMobileSofasOpen(!mobileSofasOpen)}
            >
              <span style={{ color: isSofaActive ? 'var(--color-primary)' : 'inherit', fontWeight: isSofaActive ? 700 : 600 }}>
                All Sofas
              </span>
              <ChevronDown
                size={18}
                className={`mobile-accordion-caret ${mobileSofasOpen ? 'open' : ''}`}
              />
            </button>
            {mobileSofasOpen && (
              <ul className="mobile-accordion-sublinks">
                <li>
                  <Link
                    to="/collections"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mobile-accordion-sublink ${location.pathname === '/collections' && !location.search ? 'active' : ''}`}
                  >
                    All Sofas Collection
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections?category=l-shaped-sofas"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mobile-accordion-sublink ${location.search.toLowerCase().includes('l-shaped') ? 'active' : ''}`}
                  >
                    L-Shape Sofas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections?category=sofa-combos"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mobile-accordion-sublink ${location.search.toLowerCase().includes('combos') ? 'active' : ''}`}
                  >
                    Sofa Combos (3+1+1)
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections?category=3-seater-sofas"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mobile-accordion-sublink ${location.search.toLowerCase().includes('3-seater') ? 'active' : ''}`}
                  >
                    3 Seater Sofas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections?category=recliner-sofas"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mobile-accordion-sublink ${location.search.toLowerCase().includes('recliner') ? 'active' : ''}`}
                  >
                    Recliner Sofas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections?filter=new-arrivals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-accordion-sublink"
                    style={{ color: 'var(--color-primary)', fontWeight: 600 }}
                  >
                    ★ New Arrivals 2026
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Mattress & Beddings Accordion */}
          <li>
            <button
              type="button"
              className="mobile-accordion-header"
              onClick={() => setMobileMattressOpen(!mobileMattressOpen)}
            >
              <span style={{ color: isMattressActive ? 'var(--color-primary)' : 'inherit', fontWeight: isMattressActive ? 700 : 600 }}>
                Mattress &amp; Beddings
              </span>
              <ChevronDown
                size={18}
                className={`mobile-accordion-caret ${mobileMattressOpen ? 'open' : ''}`}
              />
            </button>
            {mobileMattressOpen && (
              <ul className="mobile-accordion-sublinks">
                <li>
                  <Link
                    to="/collections?category=mattress-beddings"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mobile-accordion-sublink ${location.search.toLowerCase().includes('category=mattress-beddings') && !location.search.includes('type=') ? 'active' : ''}`}
                  >
                    All Mattresses &amp; Beddings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections?category=mattress-beddings&type=orthopedic"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mobile-accordion-sublink ${location.search.includes('type=orthopedic') ? 'active' : ''}`}
                  >
                    Orthopedic Mattresses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections?category=mattress-beddings&type=pocket-spring"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mobile-accordion-sublink ${location.search.includes('type=pocket-spring') ? 'active' : ''}`}
                  >
                    Pocket Spring Mattresses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections?category=mattress-beddings&type=memory-foam"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mobile-accordion-sublink ${location.search.includes('type=memory-foam') ? 'active' : ''}`}
                  >
                    Memory Foam Mattresses
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Pillows & Cushions Accordion */}
          <li>
            <button
              type="button"
              className="mobile-accordion-header"
              onClick={() => setMobilePillowsOpen(!mobilePillowsOpen)}
            >
              <span style={{ color: isPillowActive ? 'var(--color-primary)' : 'inherit', fontWeight: isPillowActive ? 700 : 600 }}>
                Pillows &amp; Cushions
              </span>
              <ChevronDown
                size={18}
                className={`mobile-accordion-caret ${mobilePillowsOpen ? 'open' : ''}`}
              />
            </button>
            {mobilePillowsOpen && (
              <ul className="mobile-accordion-sublinks">
                <li>
                  <Link
                    to="/collections?category=pillow-cushion"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mobile-accordion-sublink ${location.search.toLowerCase().includes('category=pillow-cushion') && !location.search.includes('type=') ? 'active' : ''}`}
                  >
                    All Pillows &amp; Cushions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections?category=pillow-cushion&type=throw-cushions"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mobile-accordion-sublink ${location.search.includes('type=throw-cushions') ? 'active' : ''}`}
                  >
                    Decorative Throw Cushions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections?category=pillow-cushion&type=neck-pillows"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mobile-accordion-sublink ${location.search.includes('type=neck-pillows') ? 'active' : ''}`}
                  >
                    Orthopedic Neck Pillows
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections?category=pillow-cushion&type=bed-pillows"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mobile-accordion-sublink ${location.search.includes('type=bed-pillows') ? 'active' : ''}`}
                  >
                    Sleeping &amp; Bed Pillows
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Offers */}
          <li>
            <a
              href="/#offers"
              onClick={handleNavigateToOffers}
              className={`mobile-nav-link ${isOffersActive ? 'active' : ''}`}
            >
              <span>Offers</span>
            </a>
          </li>

          {/* Become a Dealer */}
          <li>
            <Link
              to="/become-a-dealer"
              onClick={() => setMobileMenuOpen(false)}
              className={`mobile-nav-link ${isDealerActive ? 'active' : ''}`}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Become a Dealer
                <span className="badge-dealer-pill">Wholesale</span>
              </span>
            </Link>
          </li>

          {/* About Us */}
          <li>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`mobile-nav-link ${isAboutActive ? 'active' : ''}`}
            >
              About Us
            </Link>
          </li>

          {/* Contact Us */}
          <li>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`mobile-nav-link ${isContactActive ? 'active' : ''}`}
            >
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Drawer CTAs */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1.5rem' }}>
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
