import React, { useEffect, useState, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";
import { loadToken } from "./utils/authStorage";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load token and update state
  const updateAuthState = useCallback(async () => {
    try {
      const token = await loadToken();
      console.log("App: Token loaded:", token ? "present" : "not found");
      setIsLoggedIn(!!token);
      // Note: userType is loaded by RootNavigator from secure storage
    } catch (error) {
      console.error("App: Error loading token:", error);
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    // Initial token load
    updateAuthState().then(() => setLoading(false));

    // Listen for app state changes (app comes to foreground)
    // This ensures we refresh auth state when returning from browser OAuth flow
    const subscription = AppState.addEventListener("change", (state: AppStateStatus) => {
      if (state === "active") {
        console.log("App: Returned to foreground, refreshing auth state");
        updateAuthState();
      }
    });

    // Set up periodic polling to detect token changes from storage
    // This handles login/logout that happens within the app
    // Polls every 300ms to provide responsive UI updates
    const tokenCheckInterval = setInterval(() => {
      updateAuthState();
    }, 300); // Check every 300ms for storage changes (responsive but not excessive)

    return () => {
      subscription.remove();
      clearInterval(tokenCheckInterval);
    };
  }, [updateAuthState]);

  if (loading) return null;

  return (
    <NavigationContainer>
      <RootNavigator isLoggedIn={isLoggedIn} />
    </NavigationContainer>
  );
}
