import type {InspectionListItem} from '../../components/inspections/InspectionListCard';
import {getApiBaseUrl} from '../../config/env';
import {FALLBACK_INSPECTION_LIST} from '../../inspections/fallbackInspectionList';
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

/**
 * GET /api/inspections (Bearer). On failure or empty payload, returns the same
 * dummy list as before so the screen layout stays identical.
 */
export async function fetchInspectionsList(): Promise<InspectionListItem[]> {
  const token = useAuthStore.getState().accessToken;
  if (!token) {
    return [...FALLBACK_INSPECTION_LIST];
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/api/inspections`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const parsed = parseJson(await res.text());
    if (!res.ok || !isValidSuccessResponse(parsed)) {
      return [...FALLBACK_INSPECTION_LIST];
    }

    const rows = parsed.data.inspections;
    if (rows.length === 0) {
      return [...FALLBACK_INSPECTION_LIST];
    }

    return rows.map(mapApiInspectionToListItem);
  } catch {
    return [...FALLBACK_INSPECTION_LIST];
  }
}
