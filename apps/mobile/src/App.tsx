import React, { useEffect, useState, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";
import { loadToken } from "./utils/authStorage";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);

  // Load token and update state
  const updateAuthState = useCallback(async () => {
    try {
      const token = await loadToken();
      console.log("App: Token loaded:", token ? "present" : "not found");
      setIsLoggedIn(!!token);

      // Load userType from secure storage if logged in
      if (token) {
        try {
          const userStorage = require("expo-secure-store");
          const userData = await userStorage.getItemAsync("userData");
          if (userData) {
            const parsed = JSON.parse(userData);
            setUserType(parsed.userType || "creator");
          }
        } catch (e) {
          console.error("Failed to load user type:", e);
          setUserType("creator");
        }
      }
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

    return () => {
      subscription.remove();
    };
  }, [updateAuthState]);

  if (loading) return null;

  return (
    <NavigationContainer>
      <RootNavigator isLoggedIn={isLoggedIn} />
    </NavigationContainer>
  );
}
