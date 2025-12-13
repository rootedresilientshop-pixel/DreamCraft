import React, { useEffect, useState, useCallback } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import { loadToken } from "./utils/authStorage";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigation/RootNavigator";
import * as SecureStore from "expo-secure-store";

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
    const tokenCheckInterval = setInterval(() => {
      updateAuthState();
    }, 500); // Check every 500ms for storage changes

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
