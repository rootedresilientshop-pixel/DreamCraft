import React, { useEffect, useState } from "react";
import { loadToken } from "./utils/authStorage";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load token and update state
  async function updateAuthState() {
    const token = await loadToken();
    console.log("App: Token updated:", token);
    setIsLoggedIn(!!token);
  }

  useEffect(() => {
    // Initial token load
    updateAuthState().then(() => setLoading(false));

    // Listen for custom login/logout events
    window.addEventListener("auth-changed", updateAuthState);

    return () => {
      window.removeEventListener("auth-changed", updateAuthState);
    };
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      <RootNavigator isLoggedIn={isLoggedIn} />
    </NavigationContainer>
  );
}
