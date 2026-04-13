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
  comment?: string;
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
  const requestBody: Record<string, unknown> = {
    id: payload.id ?? '',
    questionId: payload.questionId,
    value: payload.value,
  };
  if (payload.value === 'NO') {
    if (payload.severity) {
      requestBody.severity = payload.severity;
    }
    const comment = typeof payload.comment === 'string' ? payload.comment.trim() : '';
    if (comment) {
      requestBody.comment = comment;
    }
  }
  const payloadText = JSON.stringify(requestBody);

  try {
    const res = await fetch(endpoint, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    const bodyText = await res.text();
    const parsed = parseJson(bodyText);
    if (!res.ok) {
      const data = isRecord(parsed) && isRecord(parsed.data) ? parsed.data : null;
      const explicit =
        (isRecord(parsed) && typeof parsed.message === 'string' && parsed.message.trim()) ||
        (data && typeof data.message === 'string' && data.message.trim()) ||
        (data && typeof data.error === 'string' && data.error.trim()) ||
        (typeof bodyText === 'string' && bodyText.trim()) ||
        '';
      return {
        ok: false,
        error: explicit
          ? `Could not save answer (${res.status}): ${explicit}\nPayload: ${payloadText}`
          : `Could not save answer (${res.status}).\nPayload: ${payloadText}`,
      };
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
    return {ok: false, error: `${msg}\nPayload: ${payloadText}`};
  }
}
