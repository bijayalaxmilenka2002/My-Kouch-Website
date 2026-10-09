import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle,
  Send,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useSofa } from '../context/SofaContext';
import { submitEnquiry } from '../services/api';

const ENQUIRY_TYPES = [
  'General Enquiry',
  'Pricing & Discount Offers',
  'Mattress & Beddings Enquiry',
  'Pillows & Cushions Enquiry',
  'Showroom Visit & Trial',
  'Custom Build / Fabric Details',
  'Bulk & Interior Project',
];

export default function EnquiryContactModal() {
  const { isEnquiryOpen, enquiryProduct, closeEnquiryModal } = useSofa();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    product: 'General Sofa Enquiry',
    enquiryType: 'General Sofa Enquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (enquiryProduct) {
      setFormData((prev) => ({
        ...prev,
        product: enquiryProduct.name || 'General Sofa Enquiry',
        enquiryType: 'Pricing & Discount Offers',
        message: `Hello myKouch, I would like to enquire about "${enquiryProduct.name}". Please share pricing, fabric options, and delivery timeline.`,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        product: 'General Sofa Enquiry',
        enquiryType: 'General Sofa Enquiry',
        message: '',
      }));
    }
    setSuccess(false);
    setErrorMessage('');
  }, [enquiryProduct, isEnquiryOpen]);

  if (!isEnquiryOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.phone.trim()) {
      setErrorMessage('Please enter both your Name and Phone Number.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        product: formData.product || 'General Sofa Enquiry',
        productId: enquiryProduct?._id || null,
        enquiryType: formData.enquiryType || 'General Contact',
        message: formData.message.trim(),
      };

      const res = await submitEnquiry(payload);
      if (res.success) {
        setSuccess(true);
      } else {
        setErrorMessage(res.message || 'Unable to submit enquiry. Please call us directly.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error submitting enquiry. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const msg = `Hi myKouch, I would like to make an enquiry regarding sofas at your showroom.${
      formData.product && formData.product !== 'General Sofa Enquiry'
        ? ` Product: ${formData.product}`
        : ''
    }`;
    window.open(`https://wa.me/918093376990?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="modal-backdrop" onClick={closeEnquiryModal}>
      <div
        className="modal-card"
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-text">
            <div className="modal-badge-row">
              <span className="modal-section-badge">
                <Sparkles size={11} />
                <span>CUSTOMER DESK &amp; SHOWROOM</span>
              </span>
            </div>
            <h2 className="modal-title">
              Enquiry &amp; Contact
            </h2>
            <p className="modal-subtitle">
              Get factory-direct pricing, fabric swatches, or schedule a showroom visit in Bhubaneswar.
            </p>
          </div>

          <button
            type="button"
            onClick={closeEnquiryModal}
            className="modal-close-btn"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {success ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--color-success-bg, #DEF7EC)',
                  color: 'var(--color-success, #0E9F6E)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <CheckCircle size={36} />
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.6rem',
                  color: 'var(--color-espresso)',
                  marginBottom: '0.5rem',
                }}
              >
                Enquiry Received!
              </h3>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.96rem',
                  lineHeight: 1.6,
                  maxWidth: '440px',
                  margin: '0 auto 1.5rem',
                }}
              >
                Thank you, <strong>{formData.customerName}</strong>. Our team has received your details and will connect with you at <strong>{formData.phone}</strong> shortly.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <MessageSquare size={16} />
                  <span>Chat on WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={closeEnquiryModal}
                  className="btn btn-primary"
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Quick Contact Bar */}
              <div className="modal-quick-contact">
                <div className="quick-contact-info">
                  <div className="quick-contact-label">
                    Instant Assistance
                  </div>
                  <div className="quick-contact-phone">
                    +91 80933 76990
                  </div>
                </div>

                <div className="quick-contact-btn-group">
                  <a
                    href="tel:+918093376990"
                    className="quick-call-btn"
                  >
                    <Phone size={14} />
                    <span>Call Now</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="quick-whatsapp-btn"
                  >
                    <MessageSquare size={14} />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Form Section Header */}
              <div className="modal-section-divider" style={{ marginTop: '0.5rem' }}>
                <span className="modal-section-badge">01</span>
                <span className="modal-section-heading">Send Us A Message</span>
              </div>

              {errorMessage && (
                <div
                  style={{
                    background: '#FEE2E2',
                    color: '#991B1B',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm, 6px)',
                    fontSize: '0.88rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="enq-customerName">
                      <span>Full Name</span>
                      <span className="required-star">*</span>
                    </label>
                    <input
                      id="enq-customerName"
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="e.g. Priyadarshini Mohapatra"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="enq-phone">
                      <span>Phone (WhatsApp)</span>
                      <span className="required-star">*</span>
                    </label>
                    <input
                      id="enq-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 98765 43210"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="enq-email">
                      <span>Email Address</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Optional)</span>
                    </label>
                    <input
                      id="enq-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="enq-type">
                      <span>Enquiry Type</span>
                    </label>
                    <select
                      id="enq-type"
                      name="enquiryType"
                      value={formData.enquiryType}
                      onChange={handleChange}
                      className="form-input"
                    >
                      {ENQUIRY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.product && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="enq-product">
                      <span>Interested Sofa Model / Item</span>
                    </label>
                    <input
                      id="enq-product"
                      type="text"
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      placeholder="e.g. Royal Noir Chesterfield or L-Shape"
                      className="form-input"
                    />
                  </div>
                )}

                <div className="form-group" style={{ width: '100%' }}>
                  <label className="form-label" htmlFor="enq-message">
                    <span>Your Message / Requirements</span>
                  </label>
                  <textarea
                    id="enq-message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what you're looking for, room dimensions, preferred seating, or delivery timeline..."
                    className="form-input"
                    style={{
                      width: '100%',
                      minHeight: '110px',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      display: 'block',
                    }}
                  />
                </div>

                {/* Showroom Address Note */}
                <div className="modal-showroom-note">
                  <MapPin size={15} color="var(--color-primary)" />
                  <span>MB Marketing Showroom: AM42 Bhimatangi (Near Mo Bus Stop) • Factory: Sunderipada, Bhubaneswar</span>
                </div>

                {/* Action Buttons */}
                <div className="modal-action-btns-row">
                  <button
                    type="button"
                    onClick={closeEnquiryModal}
                    className="btn btn-light"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                  >
                    <Send size={15} />
                    <span>{loading ? 'Submitting...' : 'Submit Enquiry'}</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
