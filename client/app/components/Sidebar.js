'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../AuthProvider';
import { 
  LayoutDashboard, 
  TrendingUp, 
  BrainCircuit, 
  MessageSquareCode, 
  Users, 
  LogOut,
  Activity
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Market', path: '/market', icon: TrendingUp },
    { name: 'AI Analyzer', path: '/analyzer', icon: BrainCircuit },
    { name: 'AI Chat', path: '/chat', icon: MessageSquareCode },
    { name: 'Community', path: '/community', icon: Users },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Activity size={24} className="logo-pulse" />
        <span>StockPulse</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {user.username ? user.username.slice(0, 2).toUpperCase() : 'SP'}
          </div>
          <div className="user-info">
            <span className="username">{user.username}</span>
            <span className="status-indicator">Online</span>
          </div>
        </div>
        <button onClick={logout} className="logout-btn" title="Logout">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          background: #000000;
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 24px;
          z-index: 100;
          transition: all 0.3s ease;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.4rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          margin-bottom: 40px;
        }

        .logo-pulse {
          color: var(--primary);
          filter: drop-shadow(0 0 8px var(--primary-glow));
          animation: pulseIcon 2s infinite ease-in-out;
        }

        @keyframes pulseIcon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 24px;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          color: var(--text-secondary);
          border-radius: 10px;
          font-weight: 500;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .nav-item:hover {
          color: var(--primary);
          background: rgba(0, 230, 118, 0.04);
          border-color: rgba(0, 230, 118, 0.08);
        }

        .nav-item.active {
          color: #000000;
          background: var(--primary);
          font-weight: 700;
          box-shadow: 0 4px 14px var(--primary-glow);
        }

        .sidebar-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: var(--primary-glow);
          border: 1px solid var(--primary);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .username {
          font-size: 0.95rem;
          font-weight: 600;
          color: #ffffff;
        }

        .status-indicator {
          font-size: 0.75rem;
          color: var(--success);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .status-indicator::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          background: var(--success);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--success);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          background: rgba(255, 51, 102, 0.05);
          border: 1px solid rgba(255, 51, 102, 0.15);
          color: var(--danger);
          padding: 10px 16px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          justify-content: center;
        }

        .logout-btn:hover {
          background: var(--danger);
          color: #ffffff;
          box-shadow: 0 4px 12px var(--danger-glow);
        }

        /* Responsive Mobile Layout rules */
        @media (max-width: 768px) {
          .sidebar {
            width: 100vw;
            height: 60px;
            position: fixed;
            bottom: 0;
            top: auto;
            left: 0;
            flex-direction: row;
            padding: 0 16px;
            border-right: none;
            border-top: 1px solid var(--border);
            justify-content: space-between;
            align-items: center;
            border-radius: 16px 16px 0 0;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.8);
          }

          .sidebar-logo, 
          .sidebar-footer {
            display: none;
          }

          .sidebar-nav {
            flex-direction: row;
            width: 100%;
            justify-content: space-around;
            gap: 0;
          }

          .nav-item {
            padding: 10px;
            gap: 0;
            border-radius: 8px;
          }

          .nav-item span {
            display: none; /* Hide label text on mobile */
          }
        }
      `}</style>
    </aside>
  );
}
