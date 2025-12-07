import React, { useEffect, useState } from "react";
import { loadToken } from "./utils/authStorage";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkToken() {
      const token = await loadToken();
      console.log("App: Checking token on mount:", token);

      if (token) setIsLoggedIn(true);
      setLoading(false);
    }
    checkToken();

    // Listen for token changes (web only)
    const listener = () => {
      loadToken().then((t) => {
        console.log("Storage changed:", t);
        setIsLoggedIn(!!t);
      });
    };

    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      <RootNavigator isLoggedIn={isLoggedIn} />
    </NavigationContainer>
  );
}
