import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, Send, Sliders, MessageSquare, ChevronDown, Check } from 'lucide-react';
import { useSofa } from '../context/SofaContext';
import { submitEnquiry } from '../services/api';

const COLOR_OPTIONS = [
  { name: 'Emerald Teal', hex: '#1B6B5D', border: '#135449', desc: 'Royal Velvet Teal' },
  { name: 'Warm Terracotta Rust', hex: '#C86228', border: '#A64F1E', desc: 'myKouch Signature Rust' },
  { name: 'Royal Bordeaux Maroon', hex: '#6E1A29', border: '#53131E', desc: 'Deep Wine Maroon' },
  { name: 'Pristine Ivory Cream', hex: '#F3EDE2', border: '#D5CBBB', desc: 'Warm Ivory Neutral' },
  { name: 'Charcoal Slate Grey', hex: '#374151', border: '#222831', desc: 'Modern Slate Grey' },
  { name: 'Deep Navy Blue', hex: '#1B2A47', border: '#111D33', desc: 'Midnight Royal Navy' },
  { name: 'Custom Dual-Tone', hex: 'linear-gradient(135deg, #1B6B5D 50%, #C86228 50%)', border: '#C5A059', desc: 'Dual Contrast Tones' },
];

export default function CustomSofaModal() {
  const { isCustomizeOpen, customSofaProduct, closeCustomizeModal } = useSofa();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    product: '',
    enquiryType: 'Customization',
    sofaType: 'L-Shaped Sofas',
    seatingPreference: '6 Seater',
    preferredSize: '',
    preferredColor: 'Emerald Teal',
    fabricPreference: 'Royal Velvet',
    roomDimensions: '',
    customRequirements: '',
    message: '',
  });

  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const colorDropdownRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Close color dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (colorDropdownRef.current && !colorDropdownRef.current.contains(e.target)) {
        setColorDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Pre-fill when opened with a specific product
  useEffect(() => {
    if (customSofaProduct) {
      setFormData((prev) => ({
        ...prev,
        product: customSofaProduct.name || '',
        sofaType: customSofaProduct.category || 'L-Shaped Sofas',
        seatingPreference: customSofaProduct.seatingCapacity || '3 Seater',
        preferredSize: customSofaProduct.dimensions || '',
        message: `I am interested in customizing ${customSofaProduct.name}.`,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        product: 'Custom Bespoke Sofa Project',
      }));
    }
    setSuccess(false);
    setErrorMessage('');
    setColorDropdownOpen(false);
  }, [customSofaProduct, isCustomizeOpen]);

  if (!isCustomizeOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const activeColor =
    COLOR_OPTIONS.find((c) => c.name === formData.preferredColor) ||
    COLOR_OPTIONS.find((c) => c.name.toLowerCase().includes(formData.preferredColor.toLowerCase())) ||
    COLOR_OPTIONS[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone) {
      setErrorMessage('Please enter your Name and Phone Number.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        product: formData.product || 'Custom Sofa Requirement',
        productId: customSofaProduct?._id || null,
        enquiryType: formData.enquiryType,
        customizationDetails: {
          sofaType: formData.sofaType,
          seatingPreference: formData.seatingPreference,
          preferredSize: formData.preferredSize,
          preferredColor: formData.preferredColor,
          fabricPreference: formData.fabricPreference,
          roomDimensions: formData.roomDimensions,
          customRequirements: formData.customRequirements,
        },
        message: formData.message,
      };

      const res = await submitEnquiry(payload);
      if (res.success) {
        setSuccess(true);
      } else {
        setErrorMessage(res.message || 'Submission failed');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error submitting customization enquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeCustomizeModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-text">
            <div className="modal-badge-row">
              <span className="modal-section-badge">
                <Sliders size={12} />
                <span>BESPOKE WORKSHOP</span>
              </span>
            </div>
            <h2 className="modal-title">Customize Your Sofa</h2>
            <p className="modal-subtitle">
              Choose your custom dimensions, preferred fabrics, and foam firmness.
            </p>
          </div>
          <button
            onClick={closeCustomizeModal}
            className="modal-close-btn"
            aria-label="Close Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {success ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <CheckCircle size={36} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-espresso)' }}>
                Customization Request Received!
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Thank you, <strong>{formData.customerName}</strong>! Our sofa artisan will review your room dimensions and custom fabric requirements and contact you at <strong>{formData.phone}</strong>.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/918093376990?text=${encodeURIComponent(`Hi myKouch, I just submitted an enquiry for ${formData.product} under name ${formData.customerName}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <MessageSquare size={16} />
                  <span>Connect on WhatsApp</span>
                </a>
                <button onClick={closeCustomizeModal} className="btn btn-light">
                  <span>Close Window</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="modal-note-box">
                <strong>Handcrafted to Order:</strong> Custom length, depth, upholstery fabric, and HR foam density crafted directly in our Bhubaneswar workshop.
              </div>

              {errorMessage && (
                <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '0.65rem 0.95rem', borderRadius: 'var(--radius-xs)', marginBottom: '1rem', fontSize: '0.82rem' }}>
                  {errorMessage}
                </div>
              )}

              {/* Section 01: Sofa Specifications */}
              <div className="modal-section-divider">
                <span className="modal-section-badge">01</span>
                <span className="modal-section-heading">Sofa Configuration</span>
              </div>

              {/* Product Reference */}
              <div className="form-group">
                <label className="form-label">
                  <span>Sofa Model / Design Reference</span>
                </label>
                <input
                  type="text"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  placeholder="e.g. Royal Emerald Sectional"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    <span>Sofa Category</span>
                    <span className="required-mark">*</span>
                  </label>
                  <select
                    name="sofaType"
                    value={formData.sofaType}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                  >
                    <option value="L-Shaped Sofas">L-Shaped / Corner Sectional</option>
                    <option value="Sofa Combos">Sofa Combo (3+1+1 / 3+2)</option>
                    <option value="3 Seater Sofas">3-Seater Linear Sofa</option>
                    <option value="Recliner Sofas">Motorized / Manual Recliner</option>
                    <option value="2 Seater Sofas">2-Seater / Loveseat</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Seating Preference</span>
                  </label>
                  <select
                    name="seatingPreference"
                    value={formData.seatingPreference}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                  >
                    <option value="3 Seater">3 Seater</option>
                    <option value="5 Seater (3+1+1)">5 Seater Suite (3+1+1)</option>
                    <option value="6 Seater (L-Shape Right Chaise)">6 Seater L-Shape (Right Chaise)</option>
                    <option value="6 Seater (L-Shape Left Chaise)">6 Seater L-Shape (Left Chaise)</option>
                    <option value="7+ Seater Grand Sectional">7+ Seater Grand Sectional</option>
                    <option value="Single Recliner">Single Recliner</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    <span>Fabric / Upholstery</span>
                  </label>
                  <select
                    name="fabricPreference"
                    value={formData.fabricPreference}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                  >
                    <option value="Royal Velvet">Royal Velvet (Silk / Matte)</option>
                    <option value="Premium Leatherette">Breathable Leatherette (Wipe-clean)</option>
                    <option value="Textured Bouclé">Textured Bouclé Weave</option>
                    <option value="High GSM Chenille">Performance Chenille</option>
                    <option value="Suede Microfiber">Water-Repellent Suede</option>
                  </select>
                </div>

                {/* Preferred Color Tone with Real Color Swatches */}
                <div className="form-group" ref={colorDropdownRef}>
                  <label className="form-label">
                    <span>Preferred Color Tone</span>
                  </label>

                  <div className="color-selector-wrapper">
                    <button
                      type="button"
                      className={`color-select-btn ${colorDropdownOpen ? 'open' : ''}`}
                      onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
                      aria-label="Select Color Tone"
                    >
                      <span className="color-preview-chip">
                        <span
                          className="color-dot"
                          style={{
                            background: activeColor.hex,
                            borderColor: activeColor.border,
                          }}
                        />
                        <span className="color-name-text">{activeColor.name}</span>
                      </span>
                      <ChevronDown
                        size={15}
                        style={{
                          color: 'var(--text-muted)',
                          transition: 'transform 0.2s',
                          transform: colorDropdownOpen ? 'rotate(180deg)' : 'none',
                        }}
                      />
                    </button>

                    {colorDropdownOpen && (
                      <div className="color-dropdown-menu">
                        {COLOR_OPTIONS.map((c) => (
                          <div
                            key={c.name}
                            className={`color-dropdown-item ${formData.preferredColor === c.name ? 'active' : ''}`}
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, preferredColor: c.name }));
                              setColorDropdownOpen(false);
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <span
                                className="color-dot"
                                style={{
                                  background: c.hex,
                                  borderColor: c.border,
                                }}
                              />
                              <div>
                                <div className="color-name-text" style={{ fontSize: '0.86rem' }}>
                                  {c.name}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                  {c.desc}
                                </div>
                              </div>
                            </div>
                            {formData.preferredColor === c.name && (
                              <Check size={14} style={{ color: 'var(--color-primary)' }} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick-Select Color Dots */}
                  <div className="color-swatches-quickbar">
                    <span className="swatches-quick-label">Palette:</span>
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        title={c.name}
                        className={`swatch-quick-dot ${formData.preferredColor === c.name ? 'active' : ''}`}
                        style={{ background: c.hex }}
                        onClick={() => setFormData((prev) => ({ ...prev, preferredColor: c.name }))}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 02: Dimensions & Notes */}
              <div className="modal-section-divider">
                <span className="modal-section-badge">02</span>
                <span className="modal-section-heading">Dimensions &amp; Notes</span>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    <span>Room Dimensions (Approx)</span>
                  </label>
                  <input
                    type="text"
                    name="roomDimensions"
                    value={formData.roomDimensions}
                    onChange={handleChange}
                    placeholder="e.g. 14 x 12 ft"
                    style={{ width: '100%' }}
                  />
                  <div className="form-help">Helps ensure sofa fits your living space.</div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Preferred Length</span>
                  </label>
                  <input
                    type="text"
                    name="preferredSize"
                    value={formData.preferredSize}
                    onChange={handleChange}
                    placeholder="e.g. 108 inches"
                    style={{ width: '100%' }}
                  />
                  <div className="form-help">Or mention "Standard Dimensions"</div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Custom Requirements / Notes</span>
                </label>
                <textarea
                  name="customRequirements"
                  value={formData.customRequirements}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Specify any custom firm foam, brass legs, pet-friendly fabric..."
                  style={{ width: '100%' }}
                />
              </div>

              {/* Section 03: Contact Details */}
              <div className="modal-section-divider">
                <span className="modal-section-badge">03</span>
                <span className="modal-section-heading">Contact Information</span>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    <span>Full Name</span>
                    <span className="required-mark">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="e.g. Priyanka Mohapatra"
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Phone (WhatsApp)</span>
                    <span className="required-mark">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 98765 43210"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com (optional)"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  onClick={closeCustomizeModal}
                  className="btn btn-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
