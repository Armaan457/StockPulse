'use client';

import { useState } from 'react';
import { useAuth } from '../AuthProvider';
import Link from 'next/link';
import { Activity, Lock, User, Mail, Phone, UserCheck, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !fullName || !email || !phoneNumber || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (phoneNumber.length !== 10 || isNaN(phoneNumber)) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await register(username, fullName, phoneNumber, email, password);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your credentials.');
      setSubmitting(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card glass-panel animate-fade-in">
        <div className="register-header">
          <div className="brand-logo">
            <Activity size={32} className="pulse-icon" />
          </div>
          <h1>Create Account</h1>
          <p>Join StockPulse to analyze and predict stocks</p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-with-icon">
                <UserCheck size={18} className="input-icon" />
                <input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <div className="input-with-icon">
                <Phone size={18} className="input-icon" />
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="10 digit number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary register-btn">
            {submitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account? <Link href="/login">Sign In</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .register-wrapper {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, #090d0b 0%, #000000 100%);
          padding: 20px;
        }

        .register-card {
          width: 100%;
          max-width: 520px;
          padding: 40px;
        }

        .register-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .brand-logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: rgba(79, 70, 229, 0.1);
          border: 1px solid var(--primary);
          color: var(--primary);
          margin-bottom: 20px;
          box-shadow: 0 0 16px rgba(79, 70, 229, 0.2);
        }

        .pulse-icon {
          animation: pulse 2s infinite ease-in-out;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        h1 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }

        .register-header p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .error-alert {
          background: rgba(244, 63, 94, 0.1);
          border: 1px solid rgba(244, 63, 94, 0.25);
          color: var(--danger);
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 560px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
        }

        .input-with-icon :global(.form-input) {
          padding-left: 44px;
        }

        .register-btn {
          margin-top: 10px;
          width: 100%;
          height: 48px;
        }

        .register-footer {
          margin-top: 20px;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .register-footer Link {
          color: var(--primary);
          font-weight: 600;
          transition: color var(--transition-fast);
        }

        .register-footer Link:hover {
          color: #6366f1;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
