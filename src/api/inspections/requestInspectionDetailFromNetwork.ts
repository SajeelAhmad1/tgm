import type {InspectionListItem} from '../../components/inspections/InspectionListCard';
import {getApiBaseUrl} from '../../config/env';
import {useAuthStore} from '../../store/authStore';
import type {ApiInspectionDetailDto} from './types';

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

function isApiInspectionDetailDto(v: unknown): v is ApiInspectionDetailDto {
  return isRecord(v) && typeof v.id === 'string';
}

function isValidSuccessResponse(
  v: unknown,
): v is {success: true; data: {inspection: ApiInspectionDetailDto}} {
  if (!isRecord(v) || v.success !== true) {
    return false;
  }
  const data = v.data;
  if (!isRecord(data)) {
    return false;
  }
  return isApiInspectionDetailDto(data.inspection);
}

function mapApiStatus(raw: string | undefined): InspectionListItem['status'] | undefined {
  const s = (raw ?? '').toUpperCase();
  if (s === 'IN_PROGRESS') {
    return 'in_progress';
  }
  if (s === 'COMPLETED') {
    return 'completed';
  }
  if (s === 'PENDING') {
    return 'scheduled';
  }
  return undefined;
}

function formatDateLabel(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return undefined;
  }
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

function computeProgress(items: ApiInspectionDetailDto['items']): InspectionListItem['progress'] {
  if (!Array.isArray(items) || items.length === 0) {
    return undefined;
  }

  const totals = items.reduce(
    (acc, item) => {
      const q =
        typeof item.questionCount === 'number' && Number.isFinite(item.questionCount)
          ? item.questionCount
          : 0;
      const a =
        typeof item.answeredCount === 'number' && Number.isFinite(item.answeredCount)
          ? item.answeredCount
          : 0;
      return {
        total: acc.total + Math.max(0, q),
        answered: acc.answered + Math.max(0, a),
      };
    },
    {answered: 0, total: 0},
  );

  if (totals.total <= 0) {
    return undefined;
  }
  return {answered: Math.min(totals.answered, totals.total), total: totals.total};
}

export type InspectionDetailNetworkResult =
  | {
      ok: true;
      patch: {
        list: Partial<InspectionListItem>;
        dateLabel?: string;
        issuesItemCount?: number;
      };
    }
  | {ok: false; error: string};

export async function requestInspectionDetailFromNetwork(
  inspectionId: string,
): Promise<InspectionDetailNetworkResult> {
  const token = useAuthStore.getState().accessToken;
  if (!token) {
    return {ok: false, error: 'Not signed in.'};
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/api/inspections/${inspectionId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const bodyText = await res.text();
    const parsed = parseJson(bodyText);

    if (!res.ok) {
      return {ok: false, error: `Could not load inspection (${res.status}).`};
    }
    if (!isValidSuccessResponse(parsed)) {
      return {ok: false, error: 'Invalid response from server.'};
    }

    const dto = parsed.data.inspection;
    const title = typeof dto.title === 'string' && dto.title.trim() ? dto.title.trim() : undefined;
    const address =
      typeof dto.address === 'string' && dto.address.trim() ? dto.address.trim() : undefined;
    const developer =
      typeof dto.clientName === 'string' && dto.clientName.trim()
        ? dto.clientName.trim()
        : undefined;
    const assignee =
      typeof dto.assignedTo?.name === 'string' && dto.assignedTo.name.trim()
        ? dto.assignedTo.name.trim()
        : undefined;
    const status = mapApiStatus(dto.status);
    const progress = computeProgress(dto.items);
    const dateLabel = formatDateLabel(dto.scheduledStart);
    const issuesItemCount =
      typeof dto.issuesDetectedCount === 'number' && Number.isFinite(dto.issuesDetectedCount)
        ? Math.max(0, dto.issuesDetectedCount)
        : undefined;

    return {
      ok: true,
      patch: {
        list: {title, address, developer, assignee, status, progress},
        dateLabel,
        issuesItemCount,
      },
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return {ok: false, error: msg};
  }
}
