// utils/authStorage.ts
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const STORAGE_KEY = "userToken";

export async function saveToken(token: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(STORAGE_KEY, token);
  } else {
    await SecureStore.setItemAsync(STORAGE_KEY, token);
  }
}

export async function loadToken() {
  if (Platform.OS === "web") {
    return localStorage.getItem(STORAGE_KEY);
  } else {
    return await SecureStore.getItemAsync(STORAGE_KEY);
  }
}

export async function removeToken() {
  if (Platform.OS === "web") {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
  }
}
