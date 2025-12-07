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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initialize from localStorage to avoid flash of login screen
    const token = localStorage.getItem('userToken');
    console.log('App: Initial token check:', token);
    return !!token;
  });

  useEffect(() => {
    // Listen for storage changes (including from LoginPage)
    const handleStorageChange = () => {
      const currentToken = localStorage.getItem('userToken');
      console.log('Storage changed, token:', currentToken);
      setIsLoggedIn(!!currentToken);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also create custom event for same-window updates
    const handleTokenChange = (e: Event) => {
      const currentToken = localStorage.getItem('userToken');
      console.log('Token change event, token:', currentToken);
      setIsLoggedIn(!!currentToken);
    };
    
    window.addEventListener('tokenChanged', handleTokenChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tokenChanged', handleTokenChange);
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
              element={<LoginPage onLoginSuccess={(token) => setIsLoggedIn(true)} />}
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
                      localStorage.removeItem('userToken');
                      setIsLoggedIn(false);
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
