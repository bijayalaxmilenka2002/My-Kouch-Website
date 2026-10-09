import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OwnerLoginPage() {
  const [email, setEmail] = useState('admin@mykouch.in');
  const [password, setPassword] = useState('MyKouch@2026');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/owner/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/owner/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid owner credentials');
    } finally {
      setSubmitting(false);
    }
  };

  const savedCredsRaw = typeof window !== 'undefined' ? localStorage.getItem('mykouch_custom_owner_cred') : null;
  const savedCreds = savedCredsRaw ? JSON.parse(savedCredsRaw) : null;
  const displayEmail = savedCreds?.email || 'admin@mykouch.in';
  const displayPassword = savedCreds?.password || 'MyKouch@2026';

  return (
    <div className="owner-login-page">
      <div className="owner-login-card">
        <Link to="/">
          <img
            src="/assets/logo/logo.png"
            alt="myKouch"
            className="owner-login-logo"
          />
        </Link>

        <h1 className="owner-login-title">Owner Administration</h1>
        <p className="owner-login-subtitle">
          Secure Portal to manage handcrafted sofas, orthopedic mattresses, pillows &amp; cushions, offers, and customer enquiries.
        </p>

        {/* Demo Credentials Box */}
        <div className="login-credentials-hint">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--color-espresso)', marginBottom: '0.35rem' }}>
            <ShieldCheck size={16} color="var(--color-primary)" />
            <span>Authorized Owner Access</span>
          </div>
          <div>Email: <code>{displayEmail}</code></div>
          <div>Password: <code>{displayPassword}</code></div>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left' }}>
            <AlertCircle size={16} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">Owner Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mykouch.in"
                style={{ width: '100%', paddingLeft: '2.5rem' }}
              />
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{ width: '100%', paddingLeft: '2.5rem' }}
              />
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
          >
            {submitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Owner Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
          <Link to="/" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
            &larr; Return to myKouch Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
