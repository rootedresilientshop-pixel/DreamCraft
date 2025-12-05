/**
 * Environment Configuration for DreamCraft Mobile
 *
 * Determines API URL based on build environment:
 * - Local development: localhost:3001
 * - EAS/Production: Render backend URL
 */

const getApiUrl = (): string => {
  // Check for environment variable first (set via EAS)
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return envUrl;

  // Local development fallback
  if (__DEV__) {
    return 'http://localhost:3001/api';
  }

  // Production default
  return 'https://dreamcraft-backend.onrender.com/api';
};

export const API_URL = getApiUrl();
