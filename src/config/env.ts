import {API_BASE_URL} from '@env';

/**
 * API origin without trailing slash. Configure via `.env` → `API_BASE_URL`.
 */
export function getApiBaseUrl(): string {
  const raw = (API_BASE_URL ?? '').trim().replace(/\/+$/, '');
  if (!raw) {
    throw new Error(
      'API_BASE_URL is empty. Copy .env.example to .env and set your API URL.',
    );
  }
  return raw;
}
