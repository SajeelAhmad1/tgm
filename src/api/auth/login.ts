import {getApiBaseUrl} from '../../config/env';
import type {LoginResponseBody, LoginSuccessData} from './types';

export type LoginCredentials = {
  email: string;
  password: string;
};

export class LoginError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'LoginError';
  }
}

function parseJsonSafe(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isLoginResponseBody(v: unknown): v is LoginResponseBody {
  if (!isRecord(v) || typeof v.success !== 'boolean') {
    return false;
  }
  if (!v.success) {
    return true;
  }
  const data = v.data;
  if (!isRecord(data)) {
    return false;
  }
  const user = data.user;
  if (!isRecord(user)) {
    return false;
  }
  return (
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    typeof user.name === 'string' &&
    typeof user.role === 'string' &&
    typeof data.token === 'string' &&
    typeof data.refreshToken === 'string'
  );
}

/**
 * POST /api/auth/login
 */
export async function loginRequest(
  credentials: LoginCredentials,
): Promise<LoginSuccessData> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/auth/login`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email.trim(),
        password: credentials.password,
      }),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    throw new LoginError(`Could not reach server: ${msg}`);
  }

  const text = await response.text();
  const parsed = parseJsonSafe(text);

  if (!isLoginResponseBody(parsed)) {
    throw new LoginError(
      response.ok
        ? 'Invalid response from server.'
        : `Request failed (${response.status}).`,
      response.status,
    );
  }

  if (!parsed.success) {
    const msg =
      (typeof parsed.message === 'string' && parsed.message) ||
      (typeof parsed.error === 'string' && parsed.error) ||
      'Sign in failed.';
    throw new LoginError(msg, response.status);
  }

  if (!response.ok) {
    throw new LoginError('Sign in failed.', response.status);
  }

  return parsed.data;
}
