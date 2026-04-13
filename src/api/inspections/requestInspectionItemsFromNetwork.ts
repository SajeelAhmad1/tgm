import type {InspectionItemRow, ItemRowStatus} from '../../components/inspections/items/itemsTabTokens';
import {getApiBaseUrl} from '../../config/env';
import {useAuthStore} from '../../store/authStore';
import type {ApiInspectionItemDto} from './types';

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

function isApiItem(v: unknown): v is ApiInspectionItemDto {
  return isRecord(v) && typeof v.id === 'string';
}

function isValidSuccessResponse(
  v: unknown,
): v is {success: true; data: {items: ApiInspectionItemDto[]}} {
  if (!isRecord(v) || v.success !== true) {
    return false;
  }
  const data = v.data;
  if (!isRecord(data) || !Array.isArray(data.items)) {
    return false;
  }
  return data.items.every(isApiItem);
}

function mapStatus(raw: string | undefined): ItemRowStatus {
  const s = (raw ?? '').toUpperCase();
  if (s === 'ISSUES') {
    return 'Issues';
  }
  if (s === 'NO_ISSUES') {
    return 'No Issues';
  }
  if (s === 'IN_PROGRESS') {
    return 'In Progress';
  }
  return 'Not Assessed';
}

function safeCount(value: number | undefined): number {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return value;
  }
  return 0;
}

function mapApiItemToRow(dto: ApiInspectionItemDto): InspectionItemRow {
  return {
    id: dto.id,
    name: typeof dto.name === 'string' && dto.name.trim() ? dto.name.trim() : 'N/A',
    questionsAnswered: safeCount(dto.answeredCount),
    questionsTotal: safeCount(dto.questionCount),
    status: mapStatus(dto.status),
  };
}

export type InspectionItemsNetworkResult =
  | {ok: true; items: InspectionItemRow[]}
  | {ok: false; error: string};

export async function requestInspectionItemsFromNetwork(
  inspectionId: string,
): Promise<InspectionItemsNetworkResult> {
  const token = useAuthStore.getState().accessToken;
  if (!token) {
    return {ok: false, error: 'Not signed in.'};
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/api/inspections/${inspectionId}/items`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const bodyText = await res.text();
    const parsed = parseJson(bodyText);

    if (!res.ok) {
      return {ok: false, error: `Could not load items (${res.status}).`};
    }
    if (!isValidSuccessResponse(parsed)) {
      return {ok: false, error: 'Invalid response from server.'};
    }

    return {ok: true, items: parsed.data.items.map(mapApiItemToRow)};
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return {ok: false, error: msg};
  }
}
