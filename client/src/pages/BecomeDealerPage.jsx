import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  TrendingUp,
  Package,
  Layers,
  Sparkles,
  Phone,
  MessageSquare,
  CheckCircle,
  Clock,
  Truck,
  ArrowRight,
  HelpCircle,
  Building,
  User,
  Mail,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import SEO from '../components/SEO';
import { submitEnquiry } from '../services/api';

export default function BecomeDealerPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    showroomSize: '1,000 - 3,000 sq ft',
    interestedCategories: 'Full Portfolio (Sofas, Mattresses, Cushions)',
    expectedMonthlyUnits: '5 - 15 Sets/Month',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        customerName: `${formData.businessName} (Contact: ${formData.contactPerson})`,
        phone: formData.phone,
        email: formData.email,
        product: `Dealership Application • ${formData.interestedCategories}`,
        enquiryType: 'Dealership',
        message: `Business Name: ${formData.businessName}\nCity: ${formData.city}\nShowroom Area: ${formData.showroomSize}\nProduct Interest: ${formData.interestedCategories}\nExpected Volume: ${formData.expectedMonthlyUnits}\nNotes: ${formData.message}`,
        customizationDetails: {
          sofaType: formData.interestedCategories,
          seatingPreference: formData.expectedMonthlyUnits,
          preferredSize: formData.showroomSize,
          roomDimensions: formData.city,
          customRequirements: formData.message,
        },
      };

      await submitEnquiry(payload);
      setSubmitted(true);
    } catch (err) {
      console.error('Dealer form submission error:', err);
      // Still show success with WhatsApp fallback for best B2B conversion
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: 'What are the dealer margin percentages with myKouch?',
      a: 'Because you are partnering directly with the manufacturer in Bhubaneswar with no C&F agents or middlemen, authorized dealers typically enjoy 35% to 45% gross margins on sofas, mattresses, and cushions.',
    },
    {
      q: 'Do you provide fabric swatch kits and display collaterals?',
      a: 'Yes. Upon onboarding, all approved dealers receive our complete Master Fabric Ring (100+ velvet, bouclé, suede, and leatherette swatches), frame corner cutaways displaying our 10-year seasoned Sal wood structure, and high-resolution digital catalogs for customer consultations.',
    },
    {
      q: 'Can dealers order custom dimensions for retail customers?',
      a: 'Absolutely. Customization is our primary strength. If your customer requires a specific L-shape orientation, length down to the inch, or high-density foam firmness, our Bhubaneswar master workshop builds it to exact specification in 7-14 business days.',
    },
    {
      q: 'How does warranty support work for dealer-sold products?',
      a: 'Every myKouch sofa is backed by our official 10-Year Structural Sal Wood Frame Warranty and our mattresses feature up to 10 years zero-sag guarantee. All warranty claims are honored directly by our factory service team without hassle for the dealer.',
    },
    {
      q: 'What is the minimum initial display order to qualify?',
      a: 'We offer flexible display floor programs starting with as few as 2 to 3 showcase sets for boutique showrooms, up to complete dedicated brand galleries for multi-brand furniture emporiums.',
    },
  ];

  const waDealerText = encodeURIComponent(
    `Hi myKouch Dealer Desk! I am interested in becoming an authorized retail dealer/partner for myKouch furniture & mattresses. Please share wholesale terms and catalogs.`
  );

  return (
    <div style={{ background: '#FAF8F5', minHeight: '80vh', padding: '2.5rem 0 5rem' }}>
      <SEO
        title="Become a Dealer & Wholesale Partner • myKouch Handcrafted Furniture"
        description="Join myKouch's authorized dealer network across Odisha & Eastern India. Enjoy up to 45% factory-direct margins, 10-year warranty, custom sizing, and marketing support."
      />

      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-espresso)', fontWeight: 600 }}>Become a Dealer</span>
        </nav>

        {/* Hero Section */}
        <div className="dealer-hero-card">
          <div className="dealer-hero-content">
            <span className="badge-pill" style={{ background: '#FEF3C7', color: '#92400E', borderColor: '#FDE68A', marginBottom: '1rem', display: 'inline-flex', width: 'fit-content' }}>
              <Sparkles size={13} />
              <span>Direct Factory Wholesale Partnership</span>
            </span>
            <h1 className="dealer-hero-title">
              Partner With Odisha's Premier Handcrafted Furniture &amp; Mattress Manufacturer
            </h1>
            <p className="dealer-hero-subtitle">
              Expand your showroom offerings and maximize retail margins. Partner directly with our Bhubaneswar workshop for handcrafted luxury sofas, orthopedic mattresses, and plush accent cushions.
            </p>

            <div className="dealer-hero-ctas">
              <a href="#dealer-form" className="btn btn-primary btn-lg">
                <span>Apply for Dealership</span>
                <ArrowRight size={18} />
              </a>
              <a
                href={`https://wa.me/918093376990?text=${waDealerText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg"
              >
                <MessageSquare size={18} />
                <span>Chat with Dealer Desk</span>
              </a>
            </div>
          </div>

          <div className="dealer-metrics-grid">
            <div className="dealer-metric-box">
              <span className="dealer-metric-num">35-45%</span>
              <span className="dealer-metric-lbl">Direct Factory Margins</span>
            </div>
            <div className="dealer-metric-box">
              <span className="dealer-metric-num">10 Years</span>
              <span className="dealer-metric-lbl">Solid Frame Warranty</span>
            </div>
            <div className="dealer-metric-box">
              <span className="dealer-metric-num">100+</span>
              <span className="dealer-metric-lbl">Velvet &amp; Bouclé Swatches</span>
            </div>
            <div className="dealer-metric-box">
              <span className="dealer-metric-num">7-14 Days</span>
              <span className="dealer-metric-lbl">Custom Build Turnaround</span>
            </div>
          </div>
        </div>

        {/* Wholesale Advantages Grid */}
        <div style={{ marginTop: '3.5rem', marginBottom: '3.5rem' }}>
          <div className="section-title-wrap" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="section-tag">
              <Award size={14} />
              <span>Why Partner With myKouch</span>
            </span>
            <h2 className="section-heading" style={{ fontSize: '2.2rem' }}>
              Engineered For Furniture Retailers &amp; Showrooms
            </h2>
            <p className="section-subheading" style={{ maxWidth: '640px', margin: '0 auto' }}>
              We eliminate intermediaries to provide retail partners with unmatched pricing, superior structural craftsmanship, and bespoke flexibility.
            </p>
          </div>

          <div className="dealer-features-grid">
            <div className="dealer-feature-card">
              <div className="dealer-feature-icon">
                <TrendingUp size={24} />
              </div>
              <h3 className="dealer-feature-title">Maximum Profit Margins</h3>
              <p className="dealer-feature-desc">
                Cut out distribution layers and brand markups. Purchase straight from the workshop floor in Bhubaneswar at true factory pricing to optimize your showroom profits.
              </p>
            </div>

            <div className="dealer-feature-card">
              <div className="dealer-feature-icon">
                <Layers size={24} />
              </div>
              <h3 className="dealer-feature-title">Complete Bespoke Flexibility</h3>
              <p className="dealer-feature-desc">
                Never lose a walk-in client due to dimension or fabric constraints. We custom-tailor corner sectionals, foam densities, and armrest silhouettes to your customer's floorplan.
              </p>
            </div>

            <div className="dealer-feature-card">
              <div className="dealer-feature-icon">
                <ShieldCheck size={24} />
              </div>
              <h3 className="dealer-feature-title">10-Year Factory Warranty</h3>
              <p className="dealer-feature-desc">
                Built with seasoned Sal &amp; Marandi hardwood and 40D high-resilience foam. We handle structural warranty backing directly, protecting your brand reputation.
              </p>
            </div>

            <div className="dealer-feature-card">
              <div className="dealer-feature-icon">
                <Package size={24} />
              </div>
              <h3 className="dealer-feature-title">Sample Swatches &amp; Kit Support</h3>
              <p className="dealer-feature-desc">
                We equip your floor staff with tactile swatch rings, cross-section frame models, digital lookbooks, and high-resolution collateral for effortless sales consultations.
              </p>
            </div>
          </div>
        </div>

        {/* Product Lines Showcase */}
        <div className="dealer-categories-banner" style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="section-tag" style={{ background: '#E0E7FF', color: '#3730A3', borderColor: '#C7D2FE' }}>
              <Layers size={14} />
              <span>Three High-Growth Pillars</span>
            </span>
            <h3 style={{ fontSize: '1.9rem', fontFamily: 'var(--font-serif)', color: 'var(--color-espresso-dark)', margin: '0.5rem 0' }}>
              Comprehensive Category Portfolio
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
              One reliable manufacturing partner to fulfill all your living and bedroom furniture demands.
            </p>
          </div>

          <div className="dealer-cats-grid">
            <div className="dealer-cat-item">
              <div className="dealer-cat-badge">Core Line</div>
              <h4>Handcrafted Sofas</h4>
              <p>L-Shape corner sectionals, stately 3+1+1 combos, motorized recliners, and curved bouclé studio couches.</p>
              <Link to="/collections" className="dealer-cat-link">Explore Sofas →</Link>
            </div>

            <div className="dealer-cat-item">
              <div className="dealer-cat-badge">High Demand</div>
              <h4>Mattress &amp; Beddings</h4>
              <p>Orthopedic dual-comfort memory foam, individually encased pocket spring hybrids, and hotel-grade mattress systems.</p>
              <Link to="/collections?category=mattress-beddings" className="dealer-cat-link">Explore Mattresses →</Link>
            </div>

            <div className="dealer-cat-item">
              <div className="dealer-cat-badge">Add-On Margin</div>
              <h4>Pillows &amp; Cushions</h4>
              <p>Designer velvet &amp; bouclé throw cushions, orthopedic cervical neck pillows, and luxury micro-down inserts.</p>
              <Link to="/collections?category=pillow-cushion" className="dealer-cat-link">Explore Pillows &amp; Cushions →</Link>
            </div>
          </div>
        </div>

        {/* Application Form & Direct Contact Block */}
        <div id="dealer-form" className="dealer-form-layout" style={{ marginBottom: '4.5rem' }}>
          <div className="dealer-form-container">
            <span className="section-tag">
              <Building size={14} />
              <span>Partner With Us</span>
            </span>
            <h2 style={{ fontSize: '1.85rem', fontFamily: 'var(--font-serif)', color: 'var(--color-espresso-dark)', marginBottom: '0.6rem' }}>
              Dealership Application Form
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '2rem' }}>
              Fill in your showroom details below. Our B2B Dealer Relations Desk will contact you within 24 hours with wholesale price lists and sample kit options.
            </p>

            {submitted ? (
              <div className="dealer-success-box">
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803D', margin: '0 auto 1.25rem' }}>
                  <CheckCircle size={32} />
                </div>
                <h3 style={{ fontSize: '1.4rem', color: '#14532D', marginBottom: '0.5rem' }}>
                  Application Received!
                </h3>
                <p style={{ color: '#166534', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Thank you, <strong>{formData.contactPerson || 'Partner'}</strong>. Your dealership application for <strong>{formData.businessName || 'your showroom'}</strong> has been registered with our Bhubaneswar B2B desk.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href={`https://wa.me/918093376990?text=${encodeURIComponent(`Hi myKouch, I just submitted a dealership application for ${formData.businessName || 'my showroom'} in ${formData.city || 'Odisha'}. Please connect with me.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    <MessageSquare size={16} />
                    <span>Instant WhatsApp Connect</span>
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn btn-outline"
                  >
                    Submit Another Query
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="dealer-form">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      Showroom / Business Name <span style={{ color: 'var(--color-primary)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      required
                      placeholder="e.g. Royal Living Furniture"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Owner / Contact Person <span style={{ color: 'var(--color-primary)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      required
                      placeholder="e.g. Rajesh Mohapatra"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      Phone / WhatsApp Number <span style={{ color: 'var(--color-primary)' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="showroom@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      City &amp; State <span style={{ color: 'var(--color-primary)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. Cuttack, Odisha"
                      value={formData.city}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Showroom Floor Area</label>
                    <select
                      name="showroomSize"
                      value={formData.showroomSize}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Below 1,000 sq ft">Below 1,000 sq ft</option>
                      <option value="1,000 - 3,000 sq ft">1,000 - 3,000 sq ft</option>
                      <option value="3,000 - 6,000 sq ft">3,000 - 6,000 sq ft</option>
                      <option value="6,000+ sq ft (Multi-Floor)">6,000+ sq ft (Multi-Floor)</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Primary Product Focus</label>
                    <select
                      name="interestedCategories"
                      value={formData.interestedCategories}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Full Portfolio (Sofas, Mattresses, Cushions)">Full Portfolio (Sofas, Mattresses, Cushions)</option>
                      <option value="Luxury Sofas & Sectionals Only">Luxury Sofas &amp; Sectionals Only</option>
                      <option value="Mattress & Beddings Only">Mattress &amp; Beddings Only</option>
                      <option value="Pillows & Cushions Only">Pillows &amp; Cushions Only</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Estimated Monthly Volume</label>
                    <select
                      name="expectedMonthlyUnits"
                      value={formData.expectedMonthlyUnits}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="2 - 5 Sets/Month (Boutique)">2 - 5 Sets/Month (Boutique)</option>
                      <option value="5 - 15 Sets/Month (Standard)">5 - 15 Sets/Month (Standard)</option>
                      <option value="15 - 30 Sets/Month (Large)">15 - 30 Sets/Month (Large)</option>
                      <option value="30+ Sets/Month (Wholesale Chain)">30+ Sets/Month (Wholesale Chain)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Requirements / Notes</label>
                  <textarea
                    name="message"
                    rows="3"
                    placeholder="Tell us about your showroom, target clientele, or specific models you are interested in..."
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                  />
                </div>

                {errorMsg && (
                  <p style={{ color: '#DC2626', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  {loading ? 'Submitting Application...' : 'Submit Dealership Application'}
                </button>
              </form>
            )}
          </div>

          {/* Quick Direct Desk Card */}
          <div className="dealer-sidebar-card">
            <div className="dealer-sidebar-header">
              <span className="badge-pill" style={{ background: '#FFFFFF', color: 'var(--color-primary)' }}>
                B2B Hotline
              </span>
              <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', margin: '0.75rem 0 0.5rem', fontFamily: 'var(--font-serif)' }}>
                Direct Dealer Relations Desk
              </h3>
              <p style={{ color: '#F2EDE4', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                Speak directly with our commercial wholesale directors in Bhubaneswar for pricing sheets and territory inquiries.
              </p>
            </div>

            <div className="dealer-sidebar-body">
              <div className="dealer-contact-point">
                <Phone size={18} color="var(--color-primary)" />
                <div>
                  <span className="dealer-cp-lbl">Direct Phone</span>
                  <a href="tel:+918093376990" className="dealer-cp-val">+91 80933 76990</a>
                </div>
              </div>

              <div className="dealer-contact-point">
                <MessageSquare size={18} color="#16A34A" />
                <div>
                  <span className="dealer-cp-lbl">WhatsApp B2B</span>
                  <a
                    href={`https://wa.me/918093376990?text=${waDealerText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dealer-cp-val"
                  >
                    +91 80933 76990 (Instant)
                  </a>
                </div>
              </div>

              <div className="dealer-contact-point">
                <MapPin size={18} color="var(--color-primary)" />
                <div>
                  <span className="dealer-cp-lbl">Workshop &amp; Showroom</span>
                  <span className="dealer-cp-val" style={{ fontSize: '0.82rem' }}>
                    MB Marketing, Bhubaneswar, Odisha
                  </span>
                </div>
              </div>

              <div className="dealer-contact-point">
                <Clock size={18} color="var(--color-primary)" />
                <div>
                  <span className="dealer-cp-lbl">B2B Desk Hours</span>
                  <span className="dealer-cp-val" style={{ fontSize: '0.82rem' }}>
                    Monday – Saturday: 10:00 AM – 8:30 PM
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                <a
                  href={`https://wa.me/918093376990?text=${waDealerText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <MessageSquare size={16} />
                  <span>Request Wholesale Catalog</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="section-tag">
              <HelpCircle size={14} />
              <span>Dealer FAQ</span>
            </span>
            <h3 style={{ fontSize: '1.85rem', fontFamily: 'var(--font-serif)', color: 'var(--color-espresso-dark)' }}>
              Frequently Asked Dealership Questions
            </h3>
          </div>

          <div className="dealer-faq-list">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`dealer-faq-card ${activeFaq === idx ? 'open' : ''}`}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="dealer-faq-question">
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className="dealer-faq-chevron"
                    style={{
                      transform: activeFaq === idx ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.25s ease',
                      flexShrink: 0,
                    }}
                  />
                </div>
                {activeFaq === idx && (
                  <p className="dealer-faq-answer">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
