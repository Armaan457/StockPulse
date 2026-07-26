'use client';

import { useState } from 'react';
import { useAuth } from '../AuthProvider';
import Link from 'next/link';
import { Activity, Lock, User, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
      setSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card glass-panel animate-fade-in">
        <div className="login-header">
          <div className="brand-logo">
            <Activity size={32} className="pulse-icon" />
          </div>
          <h1>Welcome back</h1>
          <p>Access your real-time financial hub</p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary login-btn">
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account? <Link href="/register">Create one now</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-wrapper {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, #090d0b 0%, #000000 100%);
          padding: 20px;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          padding: 40px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
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

        .login-header p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .error-alert {
          background: rgba(244, 63, 94, 0.1);
          border: 1px solid rgba(244, 63, 94, 0.25);
          color: var(--danger);
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
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

        .login-btn {
          margin-top: 10px;
          width: 100%;
          height: 48px;
        }

        .login-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .login-footer Link {
          color: var(--primary);
          font-weight: 600;
          transition: color var(--transition-fast);
        }

        .login-footer Link:hover {
          color: #6366f1;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
