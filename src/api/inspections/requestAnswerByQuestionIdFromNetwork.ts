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

export type QuestionAnswerDto = {
  id?: string;
  questionId?: string;
  value?: 'YES' | 'NO' | 'NOT_ASSESSED' | string;
  severity?: string | null;
  comment?: string | null;
};

export type AnswerByQuestionResult =
  | {ok: true; answer: QuestionAnswerDto | null}
  | {ok: false; error: string};

export async function requestAnswerByQuestionIdFromNetwork(
  questionId: string,
): Promise<AnswerByQuestionResult> {
  const token = useAuthStore.getState().accessToken;
  if (!token) {
    return {ok: false, error: 'Not signed in.'};
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/api/answers/${questionId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 404) {
      return {ok: true, answer: null};
    }

    const bodyText = await res.text();
    const parsed = parseJson(bodyText);
    if (!res.ok) {
      return {ok: false, error: `Could not load answer (${res.status}).`};
    }
    if (!isRecord(parsed) || parsed.success !== true) {
      return {ok: false, error: 'Invalid response from server.'};
    }

    const data = parsed.data;
    if (!isRecord(data) || (data.answer !== null && !isRecord(data.answer))) {
      return {ok: true, answer: null};
    }
    if (data.answer === null) {
      return {ok: true, answer: null};
    }

    return {ok: true, answer: data.answer as QuestionAnswerDto};
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return {ok: false, error: msg};
  }
}
