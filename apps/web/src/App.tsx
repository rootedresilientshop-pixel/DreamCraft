import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import CollaboratorProfileWizardPage from './pages/CollaboratorProfileWizardPage';
import MarketplacePage from './pages/MarketplacePage';
import CreateIdeaPage from './pages/CreateIdeaPage';
import CollaboratorsPage from './pages/CollaboratorsPage';
import ProfilePage from './pages/ProfilePage';
import IdeaDetailPage from './pages/IdeaDetailPage';
import IdeaLeaderboardPage from './pages/IdeaLeaderboardPage';
import AdminDashboard from './pages/AdminDashboard';
import FeedbackBoardPage from './pages/FeedbackBoardPage';
import FeedbackDetailPage from './pages/FeedbackDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import NotificationsPage from './pages/NotificationsPage';
import LogoutPage from './pages/LogoutPage';
import MessagesPage from './pages/MessagesPage';
import DashboardPage from './pages/DashboardPage';
import { NotificationProvider } from './contexts/NotificationContext';
import { SocketProvider } from './contexts/SocketContext';
import { loadToken, removeToken, dispatchAuthChanged } from './utils/authStorage';
import FeedbackButton from './components/FeedbackButton';

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
    // Function to check and update auth state
    const checkAndUpdateAuthState = () => {
      const currentToken = loadToken();
      const shouldBeLoggedIn = !!currentToken;

      if (shouldBeLoggedIn !== isLoggedIn) {
        setIsLoggedIn(shouldBeLoggedIn);
      }

      // Also update userType from localStorage
      try {
        const userData = localStorage.getItem('userData');
        const parsedUserType = userData ? JSON.parse(userData).userType : null;
        if (parsedUserType !== userType) {
          setUserType(parsedUserType || null);
        }
      } catch {
        // Ignore JSON parse errors
      }
    };

    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = () => {
      checkAndUpdateAuthState();
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for custom auth-changed event (same-window updates)
    const handleAuthChanged = () => {
      setTimeout(checkAndUpdateAuthState, 50);
    };

    window.addEventListener('auth-changed', handleAuthChanged);

    // Check auth state periodically to catch changes from browser back button
    // This helps when routes don't update but auth state does
    const checkInterval = setInterval(checkAndUpdateAuthState, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-changed', handleAuthChanged);
      clearInterval(checkInterval);
    };
  }, [isLoggedIn, userType]);


  return (
    <Router>
      <SocketProvider>
        <NotificationProvider>
          <Routes>
            {/* Public routes (no login required) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/role-selection" element={<RoleSelectionPage />} />
            <Route path="/profile-wizard" element={<CollaboratorProfileWizardPage />} />

            {/* Protected routes (login required) */}
            {isLoggedIn ? (
              <>
                <Route path="/" element={<MarketplacePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/ideas/:id" element={<IdeaDetailPage />} />
                <Route path="/leaderboard" element={<IdeaLeaderboardPage />} />
                <Route path="/feedback" element={<FeedbackBoardPage />} />
                <Route path="/feedback/:id" element={<FeedbackDetailPage />} />
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

          {/* Floating Feedback Button */}
          {isLoggedIn && <FeedbackButton />}
        </NotificationProvider>
      </SocketProvider>
    </Router>
  );
}

export default App;
