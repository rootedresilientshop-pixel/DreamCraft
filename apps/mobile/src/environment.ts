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

  // 2. Local development fallback
  if (__DEV__) {
    const devUrl = "http://localhost:3001/api";
    console.log('[API Config] Development mode, using:', devUrl);
    return devUrl;
  }

  // 3. Production default (Render backend)
  const prodUrl = "https://api.render.com/api";
  console.log('[API Config] Production mode, using:', prodUrl);
  return prodUrl;
};

export const API_URL = getApiUrl();
