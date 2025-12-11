// Consistent token storage utilities for web
const TOKEN_KEY = 'userToken';

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function loadToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function dispatchAuthChanged(): void {
  window.dispatchEvent(new Event('auth-changed'));
}

export function getCurrentUserId(): string | null {
  const token = loadToken();
  if (!token) return null;

  try {
    // JWT structure: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Decode payload
    const payload = JSON.parse(atob(parts[1]));
    return payload.userId || null;
  } catch (err) {
    return null;
  }
}
