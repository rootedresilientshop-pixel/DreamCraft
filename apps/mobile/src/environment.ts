/**
 * Environment Configuration for DreamCraft Mobile
 *
 * Determines API URL based on build environment:
 * - Local development: localhost:3001 or EXPO_PUBLIC_API_URL env var
 * - Production: Render backend URL or EXPO_PUBLIC_API_URL env var
 * - EAS Build: EXPO_PUBLIC_API_URL environment variable (highest priority)
 */

const getApiUrl = (): string => {
  // 1. Check for EAS/build environment variable (highest priority)
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    console.log('[API Config] Using EXPO_PUBLIC_API_URL:', envUrl);
    return envUrl;
  }

  // 2. Development fallback - use Render backend for mobile dev testing
  if (__DEV__) {
    const devUrl = "https://dreamcraft-f8w8.onrender.com/api";
    console.log('[API Config] Development mode (mobile), using Render backend:', devUrl);
    return devUrl;
  }

  // 3. Production default (Render backend)
  // Note: For production builds, set EXPO_PUBLIC_API_URL environment variable
  const prodUrl = "https://dreamcraft-f8w8.onrender.com/api";
  console.log('[API Config] Production mode, using:', prodUrl);
  return prodUrl;
};

export const API_URL = getApiUrl();
