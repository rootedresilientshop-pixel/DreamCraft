import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MarketplacePage from './pages/MarketplacePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', color: '#999' }}>Loading...</div>;
  }

  return (
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
  );
}

export default App;
