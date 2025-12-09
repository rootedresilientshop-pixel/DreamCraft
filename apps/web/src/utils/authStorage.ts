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
