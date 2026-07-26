'use client';

import Sidebar from './Sidebar';
import { useAuth } from '../AuthProvider';
import { usePathname } from 'next/navigation';

export default function AppLayoutWrapper({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const isPublicPage = ['/login', '/register'].includes(pathname);

  if (loading) {
    return null; // Will show AuthProvider loading spinner
  }

  if (isPublicPage || !user) {
    return <>{children}</>;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>

      <style jsx global>{`
        .app-container {
          display: flex;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
          margin-left: 260px; /* Sidebar width */
          padding: 40px;
          min-height: 100vh;
          background: var(--bg-main);
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding: 20px 20px 80px 20px; /* Extra bottom padding for mobile navbar */
          }
        }
      `}</style>
    </div>
  );
}
