'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check local storage for authenticated user
    const checkAuth = () => {
      try {
        const storedUser = api.getUser();
        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (storedUser && accessToken) {
          setUser(storedUser);
        } else {
          api.clearTokens();
          setUser(null);
        }
      } catch (e) {
        console.error('Auth initialization check failed', e);
        api.clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Redirect logic based on auth status
  useEffect(() => {
    if (loading) return;

    const publicPages = ['/login', '/register'];
    const isPublicPage = publicPages.includes(pathname);

    if (!user && !isPublicPage) {
      router.replace('/login');
    } else if (user && isPublicPage) {
      router.replace('/');
    }
  }, [user, loading, pathname, router]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      await api.login(username, password);
      const storedUser = api.getUser();
      setUser(storedUser);
      setLoading(false);
      router.push('/');
    } catch (e) {
      setLoading(false);
      throw e;
    }
  };

  const register = async (username, fullName, phoneNumber, email, password) => {
    setLoading(true);
    try {
      await api.register(username, fullName, phoneNumber, email, password);
      // Auto log in after registration
      await login(username, password);
    } catch (e) {
      setLoading(false);
      throw e;
    }
  };

  const logout = async () => {
    setLoading(true);
    await api.logout();
    setUser(null);
    setLoading(false);
    router.replace('/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#000000',
          color: '#ffffff',
          fontFamily: 'Outfit, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(0, 230, 118, 0.1)',
              borderTopColor: '#00e676',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <p style={{ letterSpacing: '0.05em', color: '#94a3b8', fontSize: '0.9rem' }}>LOADING PULSE...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
