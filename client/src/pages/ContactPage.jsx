import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { submitEnquiry } from '../services/api';
import SEO from '../components/SEO';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    product: 'Showroom Visit & General Enquiry',
    enquiryType: 'General Contact',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone) {
      setError('Please provide your name and phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await submitEnquiry(formData);
      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.message || 'Submission failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit contact enquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#FAF8F5', padding: '3rem 0 6rem' }}>
      <SEO
        title="Contact &amp; Showroom Visit"
        description="Visit the myKouch sofa showroom in Bhimatangi or manufacturing workshop in Sunderipada, Bhubaneswar. Call +91 80933 76990 for custom fabric swatches and free room measurement visits."
      />
      <div className="container">
        <div className="section-header" style={{ maxWidth: '720px', marginBottom: '3.5rem' }}>
          <span className="section-tag">
            <Sparkles size={14} />
            <span>Connect With Us</span>
          </span>
          <h1 className="section-title">Visit Our Showroom or Factory</h1>
          <p className="section-subtitle">
            Experience 40D foam and pocket coils, touch 100+ fabric samples in person, or get custom furniture, mattresses &amp; cushions designed for your home.
          </p>
        </div>

        <div className="contact-layout-grid">
          {/* Contact Form Card */}
          <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '1.65rem', fontFamily: 'var(--font-serif)', color: 'var(--color-espresso)', marginBottom: '0.5rem' }}>
              Send an Enquiry
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.75rem' }}>
              Our workshop specialists will connect with you on WhatsApp or Call within hours.
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <CheckCircle size={32} />
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--color-espresso)' }}>
                  Message Received!
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Thank you, <strong>{formData.customerName}</strong>. Our team will contact you at <strong>{formData.phone}</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ customerName: '', phone: '', email: '', product: 'General Enquiry', enquiryType: 'General Contact', message: '' });
                  }}
                  className="btn btn-outline"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                    {error}
                  </div>
                )}

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Mohanty"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 94370 12345"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Email Address (Optional)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. ramesh@gmail.com"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Enquiry Nature</label>
                    <select
                      name="enquiryType"
                      value={formData.enquiryType}
                      onChange={handleChange}
                      style={{ width: '100%' }}
                    >
                      <option value="General Contact">General Showroom Query</option>
                      <option value="Customization">Custom Sizing (Sofa / Mattress / Cushion)</option>
                      <option value="Product Enquiry">Specific Product Model</option>
                      <option value="Dealership">Dealership / Commercial Query</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message or Requirements</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us what you are looking for (e.g. room size, preferred color, showroom visit timings)..."
                    style={{ width: '100%' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  {loading ? (
                    <span>Submitting Message...</span>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Enquiry to myKouch</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Direct Contact Info Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Showroom Box */}
            <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.6rem' }}>
                <MapPin size={20} />
                <span>Shop &amp; Showroom</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-espresso)', marginBottom: '0.5rem' }}>
                MB Marketing Showroom
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                AM42, Bhimatangi, Near Mo Bus Stop,
                <br />
                Bhubaneswar, Odisha - 751002
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <Clock size={16} />
                <span>Mon – Sun: 10:00 AM – 9:00 PM</span>
              </div>
            </div>

            {/* Factory Box */}
            <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.6rem' }}>
                <MapPin size={20} />
                <span>Manufacturing Factory</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-espresso)', marginBottom: '0.5rem' }}>
                MB Marketing Factory
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Jagannath Bihar, Plot No- 401, Sunderipada,
                <br />
                Near Champati Petrol Pump, Bhubaneswar, Dist. Khordha - 751002
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <Clock size={16} />
                <span>Mon – Sat: 9:00 AM – 7:30 PM</span>
              </div>
            </div>

            {/* Quick Connect Actions */}
            <div className="contact-quick-box">
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#FFFFFF' }}>
                Instant Telephone &amp; WhatsApp Support
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#D3C6B9', marginBottom: '1.25rem' }}>
                Speak directly with the shopkeeper or get photos sent directly to your phone.
              </p>
              <div className="contact-quick-btns">
                <a
                  href="tel:+918093376990"
                  className="btn btn-primary btn-sm"
                >
                  <Phone size={16} />
                  <span>+91 80933 76990</span>
                </a>
                <a
                  href="https://wa.me/918093376990"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-light btn-sm"
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
