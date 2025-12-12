import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import MarketplacePage from './pages/MarketplacePage';
import CreateIdeaPage from './pages/CreateIdeaPage';
import CollaboratorsPage from './pages/CollaboratorsPage';
import ProfilePage from './pages/ProfilePage';
import IdeaDetailPage from './pages/IdeaDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import NotificationsPage from './pages/NotificationsPage';
import LogoutPage from './pages/LogoutPage';
import MessagesPage from './pages/MessagesPage';
import DashboardPage from './pages/DashboardPage';
import { NotificationProvider } from './contexts/NotificationContext';
import { SocketProvider } from './contexts/SocketContext';
import { loadToken, removeToken, dispatchAuthChanged } from './utils/authStorage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initialize from localStorage to avoid flash of login screen
    const token = loadToken();
    return !!token;
  });

  const [userType, setUserType] = useState<string | null>(() => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed.userType || null;
      }
    } catch {
      // Ignore JSON parse errors
    }
    return null;
  });

  useEffect(() => {
    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = () => {
      const currentToken = loadToken();
      setIsLoggedIn(!!currentToken);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom auth-changed event (same-window updates)
    const handleAuthChanged = () => {
      // Delay to ensure token is actually written to localStorage
      // before we check for it (React StrictMode double-invokes this)
      setTimeout(() => {
        const currentToken = loadToken();
        // Also update userType from localStorage
        try {
          const userData = localStorage.getItem('userData');
          if (userData) {
            const parsed = JSON.parse(userData);
            setUserType(parsed.userType || null);
          }
        } catch {
          // Ignore JSON parse errors
        }
        // Only update state if token exists; don't flip to false on empty reads
        if (currentToken) {
          setIsLoggedIn(true);
        }
      }, 50); // 50ms delay to ensure localStorage write completes
    };

    window.addEventListener('auth-changed', handleAuthChanged);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-changed', handleAuthChanged);
    };
  }, []);


  return (
    <Router>
      <SocketProvider>
        <NotificationProvider>
          <Routes>
            {/* Public routes (no login required) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/role-selection" element={<RoleSelectionPage />} />

            {/* Protected routes (login required) */}
            {isLoggedIn ? (
              <>
                <Route path="/" element={<MarketplacePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/ideas/:id" element={<IdeaDetailPage />} />
                <Route path="/checkout/:id" element={<CheckoutPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/messages/direct/:userId" element={<MessagesPage />} />
                <Route path="/create-idea" element={<CreateIdeaPage />} />
                <Route path="/collaborators" element={<CollaboratorsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/logout" element={<LogoutPage />} />
              </>
            ) : null}

            {/* Redirect logic */}
            {!isLoggedIn && <Route path="/*" element={<Navigate to="/login" replace />} />}
            {isLoggedIn && <Route path="/*" element={<Navigate to="/" replace />} />}
          </Routes>
        </NotificationProvider>
      </SocketProvider>
    </Router>
  );
}

export default App;
