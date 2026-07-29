// Centralized API Configuration for SpashtCare Frontend

const FALLBACK_RENDER_URL = 'https://mr-caretaker.onrender.com';

const metaEnv = (import.meta as any).env || {};

export const API_BASE_URL: string =
  metaEnv.VITE_API_BASE_URL ||
  (metaEnv.PROD ? FALLBACK_RENDER_URL : '');

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE_URL) return cleanPath;
  return `${API_BASE_URL.replace(/\/$/, '')}${cleanPath}`;
}
