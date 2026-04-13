import {getApiBaseUrl} from '../../config/env';
import {useAuthStore} from '../../store/authStore';
import type {ApiInspectionQuestionDto} from './types';

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

function isApiQuestion(v: unknown): v is ApiInspectionQuestionDto {
  return isRecord(v) && typeof v.id === 'string';
}

function isValidSuccessResponse(
  v: unknown,
): v is {success: true; data: {questions: ApiInspectionQuestionDto[]}} {
  if (!isRecord(v) || v.success !== true) {
    return false;
  }
  const data = v.data;
  if (!isRecord(data) || !Array.isArray(data.questions)) {
    return false;
  }
  return data.questions.every(isApiQuestion);
}

export type ItemQuestionsNetworkResult =
  | {ok: true; questions: ApiInspectionQuestionDto[]}
  | {ok: false; error: string};

export async function requestItemQuestionsFromNetwork(
  itemId: string,
): Promise<ItemQuestionsNetworkResult> {
  const token = useAuthStore.getState().accessToken;
  if (!token) {
    return {ok: false, error: 'Not signed in.'};
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/api/items/${itemId}/questions`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const bodyText = await res.text();
    const parsed = parseJson(bodyText);

    if (!res.ok) {
      return {ok: false, error: `Could not load item questions (${res.status}).`};
    }
    if (!isValidSuccessResponse(parsed)) {
      return {ok: false, error: 'Invalid response from server.'};
    }

    return {ok: true, questions: parsed.data.questions};
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return {ok: false, error: msg};
  }
}
