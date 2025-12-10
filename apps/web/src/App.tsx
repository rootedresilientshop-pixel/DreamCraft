import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MarketplacePage from './pages/MarketplacePage';
import CreateIdeaPage from './pages/CreateIdeaPage';
import CollaboratorsPage from './pages/CollaboratorsPage';
import ProfilePage from './pages/ProfilePage';
import IdeaDetailPage from './pages/IdeaDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import NotificationsPage from './pages/NotificationsPage';
import { NotificationProvider } from './contexts/NotificationContext';
import { loadToken, removeToken, dispatchAuthChanged } from './utils/authStorage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initialize from localStorage to avoid flash of login screen
    const token = loadToken();
    console.log('App: Initial token check:', token);
    return !!token;
  });

  useEffect(() => {
    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = () => {
      const currentToken = loadToken();
      console.log('Storage changed, token:', currentToken);
      setIsLoggedIn(!!currentToken);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom auth-changed event (same-window updates)
    const handleAuthChanged = () => {
      // Delay to ensure token is actually written to localStorage
      // before we check for it (React StrictMode double-invokes this)
      setTimeout(() => {
        const currentToken = loadToken();
        console.log('Auth changed event, token:', currentToken);
        setIsLoggedIn(!!currentToken);
      }, 0);
    };

    window.addEventListener('auth-changed', handleAuthChanged);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-changed', handleAuthChanged);
    };
  }, []);

  useEffect(() => {
    console.log('App: isLoggedIn changed to:', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <NotificationProvider>
      <Router>
        <Routes>
          {!isLoggedIn ? (
            <Route
              path="/*"
              element={<LoginPage />}
            />
          ) : (
            <>
              <Route path="/" element={<MarketplacePage />} />
              <Route path="/ideas/:id" element={<IdeaDetailPage />} />
              <Route path="/checkout/:id" element={<CheckoutPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/create-idea" element={<CreateIdeaPage />} />
              <Route path="/collaborators" element={<CollaboratorsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route
                path="/logout"
                element={
                  <div style={{ padding: '20px', color: '#fff' }}>
                    {(() => {
                      removeToken();
                      dispatchAuthChanged();
                      window.location.href = '/';
                      return null;
                    })()}
                  </div>
                }
              />
              <Route path="/*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
