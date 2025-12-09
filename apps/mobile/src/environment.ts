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
    return "http://localhost:3001/api";
  }

  // Production: must be configured via app.json extra.apiUrl or EXPO_PUBLIC_API_URL
  return "https://api.render.com/api"; // TODO: Update after Render backend deployment
};

export const API_URL = getApiUrl();
