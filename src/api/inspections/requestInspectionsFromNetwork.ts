import type {InspectionListItem} from '../../components/inspections/InspectionListCard';
import {getApiBaseUrl} from '../../config/env';
import {useAuthStore} from '../../store/authStore';
import {mapApiInspectionToListItem} from './mapApiToListItem';
import type {ApiInspectionDto} from './types';

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

function isValidSuccessResponse(
  v: unknown,
): v is {success: true; data: {inspections: ApiInspectionDto[]}} {
  if (!isRecord(v) || v.success !== true) {
    return false;
  }
  const data = v.data;
  if (!isRecord(data)) {
    return false;
  }
  return Array.isArray(data.inspections);
}

export type NetworkInspectionsResult =
  | {ok: true; items: InspectionListItem[]}
  | {ok: false; error: string};

/**
 * GET /api/inspections — no local fallback; callers handle errors and cache.
 */
export async function requestInspectionsFromNetwork(): Promise<NetworkInspectionsResult> {
  const token = useAuthStore.getState().accessToken;
  if (!token) {
    return {ok: false, error: 'Not signed in.'};
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/api/inspections`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const bodyText = await res.text();
    const parsed = parseJson(bodyText);

    if (!res.ok) {
      return {
        ok: false,
        error: `Could not load inspections (${res.status}).`,
      };
    }

    if (!isValidSuccessResponse(parsed)) {
      return {ok: false, error: 'Invalid response from server.'};
    }

    const rows = parsed.data.inspections;
    const items = rows.map(mapApiInspectionToListItem);
    return {ok: true, items};
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return {ok: false, error: msg};
  }
}
