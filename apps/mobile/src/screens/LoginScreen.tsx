import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import api from "../api";
import { saveToken } from "../utils/authStorage";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.login(email, password);

      if (res && res.token) {
        // Store token (cross-platform: web + native)
        await saveToken(res.token);

        // Store user data including userType
        const userType = res.user?.userType || "creator";
        if (res.user) {
          try {
            if (Platform.OS === "web") {
              localStorage.setItem("userData", JSON.stringify(res.user));
            } else {
              await SecureStore.setItemAsync("userData", JSON.stringify(res.user));
            }
          } catch (e) {
            console.error("Failed to store user data:", e);
          }
        }

        // Navigate to appropriate dashboard based on userType
        if (userType === "creator") {
          navigation.reset({
            index: 0,
            routes: [{ name: "CreatorTabs" }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "CollaboratorTabs" }],
          });
        }
      } else {
        Alert.alert("Login failed", res?.error || "Unknown error");
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert("Login error", err.message || "Unknown error");
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    // Redirect to role selection screen instead of registering directly
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    navigation.navigate("RoleSelection", { email, password });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DreamCraft</Text>
      <Text style={styles.subtitle}>Where dreams become reality</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCreate} disabled={loading}>
        <Text style={styles.link}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    padding: 20,
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },
  input: {
    backgroundColor: "#111",
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 15,
    color: "#fff",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#0099ff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    minHeight: 48,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    color: "#0099ff",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    fontWeight: "500",
  },
});
