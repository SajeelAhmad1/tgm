import {getApiBaseUrl} from '../../config/env';
import {useAuthStore} from '../../store/authStore';

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown; 
  } catch {
    return null;
  }
}

function readPolishedComment(parsed: unknown): string | null {
  if (!isRecord(parsed) || parsed.success !== true) {
    return null;
  }
  const data = parsed.data;
  if (!isRecord(data)) {
    return null;
  }

  const candidates = [
    data.polishedComment,
    data.aiPolishedComment,
    data.comment,
    data.polished,
  ];
  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

export type PolishCommentNetworkResult =
  | {ok: true; polishedComment: string}
  | {ok: false; error: string};

export async function requestPolishedCommentFromNetwork(payload: {
  answerId: string;
  comment: string;
  questionText: string;
}): Promise<PolishCommentNetworkResult> {
  const token = useAuthStore.getState().accessToken;
  if (!token) {
    return {ok: false, error: 'Not signed in.'};
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/api/ai/polish-comment`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const bodyText = await res.text();
    const parsed = parseJson(bodyText);

    if (!res.ok) {
      return {ok: false, error: `Could not polish comment (${res.status}).`};
    }

    const polishedComment = readPolishedComment(parsed);
    if (!polishedComment) {
      return {ok: false, error: 'Invalid response from server.'};
    }

    return {ok: true, polishedComment};
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return {ok: false, error: msg};
  }
}
