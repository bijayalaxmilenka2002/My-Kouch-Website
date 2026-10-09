import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, Send, Sliders, MessageSquare, ChevronDown, Check, Armchair, Bed, Sparkles, Feather } from 'lucide-react';
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
    category: 'Sofas', // 'Sofas' | 'Mattress & Beddings' | 'Pillows & Cushions'
    // Sofa-specific
    sofaType: 'L-Shaped Sofas',
    seatingPreference: '6 Seater',
    // Mattress-specific
    mattressType: 'Orthopedic Dual-Comfort',
    mattressSize: 'King Size (78" x 72")',
    mattressThickness: '8 Inch (Dual Comfort)',
    mattressCover: 'Organic Bamboo Fabric (Anti-Allergen)',
    // Pillow-specific
    pillowType: 'Decorative Throw Cushion Set',
    pillowPack: 'Set of 4 Cushions',
    // Common / Dynamic
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

  // Pre-fill when opened with a specific product or category
  useEffect(() => {
    if (customSofaProduct) {
      let detectedCategory = 'Sofas';
      const cat = (customSofaProduct.category || '').toLowerCase();
      if (cat.includes('mattress') || cat.includes('bedding')) {
        detectedCategory = 'Mattress & Beddings';
      } else if (cat.includes('pillow') || cat.includes('cushion')) {
        detectedCategory = 'Pillows & Cushions';
      }

      setFormData((prev) => ({
        ...prev,
        category: detectedCategory,
        product: customSofaProduct.name || `Custom ${detectedCategory} Project`,
        sofaType: customSofaProduct.category || 'L-Shaped Sofas',
        seatingPreference: customSofaProduct.seatingCapacity || '3 Seater',
        mattressType: customSofaProduct.name?.includes('Spring')
          ? 'Pocket Spring Hybrid'
          : customSofaProduct.name?.includes('Memory')
          ? 'Cool-Gel Memory Foam'
          : 'Orthopedic Dual-Comfort',
        mattressSize: customSofaProduct.seatingCapacity || 'King Size (78" x 72")',
        mattressThickness: '8 Inch (Dual Comfort)',
        mattressCover: 'Organic Bamboo Fabric (Anti-Allergen)',
        pillowType: customSofaProduct.subType === 'neck-pillows'
          ? 'Orthopedic Cervical Neck Pillow'
          : customSofaProduct.subType === 'bed-pillows'
          ? 'Hotel Presidential Sleeping Pillow (Pair)'
          : 'Decorative Throw Cushion Set',
        pillowPack: customSofaProduct.seatingCapacity || 'Set of 4 Cushions',
        preferredSize: customSofaProduct.dimensions || '',
        message: `I am interested in customizing ${customSofaProduct.name || detectedCategory}.`,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        category: 'Sofas',
        product: 'Custom Bespoke Project',
      }));
    }
    setSuccess(false);
    setErrorMessage('');
    setColorDropdownOpen(false);
  }, [customSofaProduct, isCustomizeOpen]);

  if (!isCustomizeOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'category') {
        if (value === 'Sofas') {
          updated.fabricPreference = 'Royal Velvet';
        } else if (value === 'Mattress & Beddings') {
          updated.fabricPreference = 'Organic Bamboo Fabric';
        } else if (value === 'Pillows & Cushions') {
          updated.fabricPreference = 'Textured Bouclé';
        }
      }
      return updated;
    });
  };

  const handleCategorySelect = (newCategory) => {
    setFormData((prev) => ({
      ...prev,
      category: newCategory,
      fabricPreference:
        newCategory === 'Sofas'
          ? 'Royal Velvet'
          : newCategory === 'Mattress & Beddings'
          ? 'Organic Bamboo Fabric'
          : 'Textured Bouclé',
    }));
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
        product: formData.product || `Custom ${formData.category} Requirement`,
        productId: customSofaProduct?._id || null,
        enquiryType: formData.enquiryType,
        customizationDetails: {
          category: formData.category,
          sofaType:
            formData.category === 'Sofas'
              ? formData.sofaType
              : formData.category === 'Mattress & Beddings'
              ? formData.mattressType
              : formData.pillowType,
          seatingPreference:
            formData.category === 'Sofas'
              ? formData.seatingPreference
              : formData.category === 'Mattress & Beddings'
              ? formData.mattressSize
              : formData.pillowPack,
          preferredSize: formData.preferredSize,
          preferredColor: formData.category === 'Mattress & Beddings' ? formData.mattressCover : formData.preferredColor,
          fabricPreference: formData.fabricPreference,
          roomDimensions: formData.roomDimensions,
          customRequirements: formData.customRequirements,
          mattressThickness: formData.category === 'Mattress & Beddings' ? formData.mattressThickness : undefined,
        },
        message: formData.message || `Customization request for ${formData.category}: ${formData.product}`,
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

  const isSofa = formData.category === 'Sofas';
  const isMattress = formData.category === 'Mattress & Beddings';
  const isPillow = formData.category === 'Pillows & Cushions';

  return (
    <div className="modal-backdrop" onClick={closeCustomizeModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-text">
            <div className="modal-badge-row">
              <span className="modal-section-badge">
                <Sliders size={12} />
                <span>BESPOKE WORKSHOP DIRECT</span>
              </span>
            </div>
            <h2 className="modal-title">
              {isSofa ? 'Customize Your Sofa' : isMattress ? 'Customize Your Mattress' : 'Customize Your Pillows & Cushions'}
            </h2>
            <p className="modal-subtitle">
              Choose your category, custom dimensions, preferred fabrics, and foam firmness.
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
                Thank you, <strong>{formData.customerName}</strong>! Our master artisan will review your {formData.category.toLowerCase()} specifications and contact you at <strong>{formData.phone}</strong>.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/918093376990?text=${encodeURIComponent(`Hi myKouch, I just submitted an enquiry for ${formData.product} (${formData.category}) under name ${formData.customerName}.`)}`}
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
                {isSofa && (
                  <span>
                    <strong>Handcrafted to Order:</strong> Custom length, depth, upholstery fabric, and HR foam density crafted directly in our Bhubaneswar workshop.
                  </span>
                )}
                {isMattress && (
                  <span>
                    <strong>Direct Factory Sizing:</strong> Orthopedic dual-comfort, pocket spring hybrid, and custom cot sizing engineered with zero-sag guarantee.
                  </span>
                )}
                {isPillow && (
                  <span>
                    <strong>Artisanal Living Accents:</strong> Hand-tailored in 100+ velvet &amp; bouclé fabrics with hypoallergenic micro-cluster down or cervical memory foam.
                  </span>
                )}
              </div>

              {errorMessage && (
                <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '0.65rem 0.95rem', borderRadius: 'var(--radius-xs)', marginBottom: '1rem', fontSize: '0.82rem' }}>
                  {errorMessage}
                </div>
              )}

              {/* Master Category Selector (Requested by User) */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">
                  <span>Category</span>
                  <span className="required-mark">*</span>
                </label>
                {/* Visual Pill Buttons for Instant Switching */}
                <div className="category-pill-selector">
                  <button
                    type="button"
                    className={`category-pill-btn ${isSofa ? 'active' : ''}`}
                    onClick={() => handleCategorySelect('Sofas')}
                  >
                    <Armchair size={16} />
                    <span>Sofas</span>
                  </button>
                  <button
                    type="button"
                    className={`category-pill-btn ${isMattress ? 'active' : ''}`}
                    onClick={() => handleCategorySelect('Mattress & Beddings')}
                  >
                    <Bed size={16} />
                    <span>Mattress &amp; Beddings</span>
                  </button>
                  <button
                    type="button"
                    className={`category-pill-btn ${isPillow ? 'active' : ''}`}
                    onClick={() => handleCategorySelect('Pillows & Cushions')}
                  >
                    <Feather size={16} />
                    <span>Pillows &amp; Cushions</span>
                  </button>
                </div>

                {/* Dropdown in place of Sofa Category */}
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{ width: '100%', fontWeight: 600, color: 'var(--color-espresso)' }}
                >
                  <option value="Sofas">🛋️ Sofas (L-Shape, Combos, 3-Seater, Recliners)</option>
                  <option value="Mattress & Beddings">🛏️ Mattress &amp; Beddings (Orthopedic, Pocket Spring, Memory Foam)</option>
                  <option value="Pillows & Cushions">☁️ Pillows &amp; Cushions (Throw Cushions, Neck &amp; Sleeping Pillows)</option>
                </select>
              </div>

              {/* Section 01: Product Configuration */}
              <div className="modal-section-divider">
                <span className="modal-section-badge">01</span>
                <span className="modal-section-heading">
                  {isSofa ? 'Sofa Configuration' : isMattress ? 'Mattress Configuration' : 'Pillow & Cushion Configuration'}
                </span>
              </div>

              {/* Product Reference */}
              <div className="form-group">
                <label className="form-label">
                  <span>
                    {isSofa ? 'Sofa Model / Design Reference' : isMattress ? 'Mattress Model / Cot Reference' : 'Cushion / Pillow Model Reference'}
                  </span>
                </label>
                <input
                  type="text"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  placeholder={
                    isSofa
                      ? 'e.g. Royal Emerald Sectional or Custom Design'
                      : isMattress
                      ? 'e.g. Orthopedic Dual Comfort King or Custom Cot'
                      : 'e.g. Artisanal Bouclé Set of 4 or Custom Pillows'
                  }
                  style={{ width: '100%' }}
                />
              </div>

              {/* Dynamic Configuration Fields Based on Category */}
              {isSofa && (
                <>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        <span>Sofa Style / Sub-Type</span>
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
                        <option value="Custom Modular Sectional">Custom Curved / Modular Sectional</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span>Size / Seating Preference</span>
                      </label>
                      <select
                        name="seatingPreference"
                        value={formData.seatingPreference}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                      >
                        <option value="2 Seater">2 Seater</option>
                        <option value="3 Seater">3 Seater</option>
                        <option value="5 Seater (3+1+1)">5 Seater Suite (3+1+1)</option>
                        <option value="6 Seater (L-Shape Right Chaise)">6 Seater L-Shape (Right Chaise)</option>
                        <option value="6 Seater (L-Shape Left Chaise)">6 Seater L-Shape (Left Chaise)</option>
                        <option value="7+ Seater Grand Sectional">7+ Seater Grand Sectional</option>
                        <option value="Single Recliner">Single Recliner</option>
                        <option value="Custom Seating">Custom Seating Configuration</option>
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
                        <option value="Textured Bouclé">Textured Bouclé Weave</option>
                        <option value="Premium Leatherette">Breathable Leatherette (Wipe-clean)</option>
                        <option value="High GSM Chenille">Performance Chenille</option>
                        <option value="Suede Microfiber">Water-Repellent Suede</option>
                        <option value="Linen Cotton">Premium Cotton Linen</option>
                      </select>
                    </div>

                    {/* Preferred Color Tone with Swatches */}
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
                </>
              )}

              {isMattress && (
                <>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        <span>Mattress Type / Core</span>
                        <span className="required-mark">*</span>
                      </label>
                      <select
                        name="mattressType"
                        value={formData.mattressType}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                      >
                        <option value="Orthopedic Dual-Comfort">Orthopedic Dual-Comfort</option>
                        <option value="Pocket Spring Hybrid">Pocket Spring Hybrid (Zero-Motion Transfer)</option>
                        <option value="Cool-Gel Memory Foam">Cool-Gel Memory Foam (Pressure Relief)</option>
                        <option value="High-Resilience Natural Latex">Natural Latex &amp; HR Foam Hybrid</option>
                        <option value="Custom Hotel Mattress">Custom Hotel Presidential Suite Mattress</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span>Bed / Mattress Size</span>
                      </label>
                      <select
                        name="mattressSize"
                        value={formData.mattressSize}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                      >
                        <option value='King Size (78" x 72")'>King Size (78" x 72" / 6.5 x 6 ft)</option>
                        <option value='Queen Size (78" x 60")'>Queen Size (78" x 60" / 6.5 x 5 ft)</option>
                        <option value='Double Bed (75" x 48")'>Double Bed (75" x 48" / 6.25 x 4 ft)</option>
                        <option value='Single Bed (75" x 36")'>Single Bed (75" x 36" / 6.25 x 3 ft)</option>
                        <option value="Custom Cot Size">Custom Cot Dimensions (Custom Fit)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        <span>Thickness &amp; Firmness</span>
                      </label>
                      <select
                        name="mattressThickness"
                        value={formData.mattressThickness}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                      >
                        <option value='6 Inch (Medium Firm)'>6 Inch (Medium Firm - Orthopedic Support)</option>
                        <option value='8 Inch (Dual Comfort)'>8 Inch (Dual Comfort - Soft Top + Firm Base)</option>
                        <option value='10 Inch (Euro-Top Cloud Plush)'>10 Inch (Euro-Top Cloud Plush Hybrid)</option>
                        <option value='12 Inch (Hotel Presidential)'>12 Inch (Hotel Presidential Suite Ultra-Plush)</option>
                        <option value="Custom Thickness">Custom Thickness (5" / 7" / Custom)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span>Quilted Cover / Ticking</span>
                      </label>
                      <select
                        name="mattressCover"
                        value={formData.mattressCover}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                      >
                        <option value="Organic Bamboo Fabric (Anti-Allergen)">Organic Bamboo Fabric (Anti-Allergen Quilting)</option>
                        <option value="Ice-Silk Cooling Top">Ice-Silk Breathable Cooling Top</option>
                        <option value="Jacquard Double-Knitted Cotton">Jacquard Double-Knitted Cotton Fabric</option>
                        <option value="Waterproof Zippered Protector">Waterproof Anti-Dustmite Zippered Shell</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {isPillow && (
                <>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        <span>Pillow / Cushion Type</span>
                        <span className="required-mark">*</span>
                      </label>
                      <select
                        name="pillowType"
                        value={formData.pillowType}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                      >
                        <option value="Decorative Throw Cushion Set">Decorative Throw Cushion Set (Living Room)</option>
                        <option value="Orthopedic Cervical Neck Pillow">Orthopedic Cervical Neck Pillow (Contour Support)</option>
                        <option value="Hotel Presidential Sleeping Pillow">Hotel Presidential Sleeping Pillow (Pair)</option>
                        <option value="Floor Lounger / Bolsters">Floor Lounger / Bolster Cushions</option>
                        <option value="Bespoke Accent Pads">Bespoke Accent Pad Collection</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span>Quantity / Pack Size</span>
                      </label>
                      <select
                        name="pillowPack"
                        value={formData.pillowPack}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                      >
                        <option value="Pack of 2 Cushions">Pack of 2</option>
                        <option value="Set of 4 Cushions">Pack of 4 (Living Room Suite Set)</option>
                        <option value="Set of 6 Cushions">Pack of 6 (Complete Sofa Dressing)</option>
                        <option value="Single Pillow">Single Ergonomic Pillow</option>
                        <option value="Bulk Order (10+ Units)">Bulk Hospitality Order (10+ Units)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        <span>Fabric / Cover Material</span>
                      </label>
                      <select
                        name="fabricPreference"
                        value={formData.fabricPreference}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                      >
                        <option value="Textured Bouclé">Heavy-Textured Bouclé</option>
                        <option value="Royal Velvet">Jewel-Tone Royal Velvet</option>
                        <option value="Egyptian Cotton 400 TC">Egyptian Cotton 400 TC (Striped)</option>
                        <option value="Ice-Silk Air-Mesh">Breathable Ice-Silk Air-Mesh</option>
                        <option value="Linen Weave">Water-Resistant Linen Weave</option>
                      </select>
                    </div>

                    {/* Preferred Color Tone for Cushions */}
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
                </>
              )}

              {/* Section 02: Dimensions & Specifications */}
              <div className="modal-section-divider">
                <span className="modal-section-badge">02</span>
                <span className="modal-section-heading">
                  {isSofa ? 'Dimensions & Living Room Notes' : isMattress ? 'Bed Dimensions & Support Notes' : 'Cushion Sizes & Filling Notes'}
                </span>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    <span>
                      {isSofa ? 'Room Dimensions (Approx)' : isMattress ? 'Cot Inner Measurements' : 'Cushion Dimensions'}
                    </span>
                  </label>
                  <input
                    type="text"
                    name="roomDimensions"
                    value={formData.roomDimensions}
                    onChange={handleChange}
                    placeholder={
                      isSofa
                        ? 'e.g. 14 x 12 ft'
                        : isMattress
                        ? 'e.g. 78 x 72 inches (inner frame)'
                        : 'e.g. 18 x 18 inches, 20 x 20 inches'
                    }
                    style={{ width: '100%' }}
                  />
                  <div className="form-help">
                    {isSofa ? 'Helps ensure sofa fits living space.' : isMattress ? 'Exact mattress cavity measurement.' : 'Or specify custom square / bolster size.'}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>
                      {isSofa ? 'Preferred Sofa Length' : isMattress ? 'Bed Base / Frame Type' : 'Filling / Core Preference'}
                    </span>
                  </label>
                  <input
                    type="text"
                    name="preferredSize"
                    value={formData.preferredSize}
                    onChange={handleChange}
                    placeholder={
                      isSofa
                        ? 'e.g. 108 inches or Standard'
                        : isMattress
                        ? 'e.g. Hydraulic Storage, Solid Wood Slats'
                        : 'e.g. Micro-Down (650 GSM), Memory Foam'
                    }
                    style={{ width: '100%' }}
                  />
                  <div className="form-help">
                    {isSofa ? 'Or mention "Standard Dimensions"' : isMattress ? 'Helps tailor edge-support reinforcement.' : 'Virgin hypoallergenic micro-down or foam.'}
                  </div>
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
                  placeholder={
                    isSofa
                      ? 'Specify any custom firm foam (32D/40D), brass legs, left/right chaise side, pet-friendly fabric...'
                      : isMattress
                      ? 'Specify required firmness (Soft/Medium/Hard), spine support level, corner cuts for 4-poster bed...'
                      : 'Specify hidden brass YKK zipper, double-corded edge piping, matching existing sofa fabric...'
                  }
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
