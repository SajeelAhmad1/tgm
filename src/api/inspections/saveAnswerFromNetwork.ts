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

export type SaveAnswerPayload = {
  id?: string;
  questionId: string;
  value: 'YES' | 'NO' | 'NOT_ASSESSED';
  severity?: 'MINOR' | 'MODERATE' | 'CRITICAL' | null;
  comment: string;
};

export type SaveAnswerResult =
  | {ok: true; id: string}
  | {ok: false; error: string};

export async function saveAnswerFromNetwork(payload: SaveAnswerPayload): Promise<SaveAnswerResult> {
  const token = useAuthStore.getState().accessToken;
  if (!token) {
    return {ok: false, error: 'Not signed in.'};
  }

  const method = payload.id ? 'PUT' : 'POST';
  const endpoint = payload.id ? `${getApiBaseUrl()}/api/answers/${payload.id}` : `${getApiBaseUrl()}/api/answers`;

  try {
    const res = await fetch(endpoint, {
      method,
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
      return {ok: false, error: `Could not save answer (${res.status}).`};
    }
    if (!isRecord(parsed) || parsed.success !== true) {
      return {ok: false, error: 'Invalid response from server.'};
    }
    const data = parsed.data;
    const answer = isRecord(data) && isRecord(data.answer) ? data.answer : null;
    const id = answer && typeof answer.id === 'string' ? answer.id : payload.id;
    if (!id) {
      return {ok: false, error: 'Saved but answer id missing in response.'};
    }
    return {ok: true, id};
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return {ok: false, error: msg};
  }
}
