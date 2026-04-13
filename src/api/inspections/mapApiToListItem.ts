import type {InspectionListItem} from '../../components/inspections/InspectionListCard';
import type {InspectionCardStatus} from '../../components/inspections/InspectionStatusBadge';
import type {ApiInspectionDto} from './types';

const DUMMY = {
  timeRange: '9:00 AM – 11:30 AM',
  developer: 'Bayside Development',
  assignee: 'James Mitchell',
  title: 'Inspection',
  address: '—',
} as const;

function formatTimeLabel(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

function formatScheduledRange(
  scheduledStart: string | undefined,
  scheduledEnd: string | undefined,
): string {
  if (!scheduledStart || !scheduledEnd) {
    return DUMMY.timeRange;
  }
  const start = formatTimeLabel(scheduledStart);
  const end = formatTimeLabel(scheduledEnd);
  if (!start || !end) {
    return DUMMY.timeRange;
  }
  return `${start} – ${end}`;
}

function mapApiStatus(raw: string | undefined): InspectionCardStatus {
  const s = (raw ?? '').toUpperCase();
  if (s === 'IN_PROGRESS') {
    return 'in_progress';
  }
  if (s === 'COMPLETED') {
    return 'completed';
  }
  return 'scheduled';
}

function safeProgress(
  answered: number | undefined,
  total: number | undefined,
): {answered: number; total: number} | undefined {
  const t =
    typeof total === 'number' && Number.isFinite(total) && total > 0
      ? total
      : undefined;
  const a =
    typeof answered === 'number' && Number.isFinite(answered) && answered >= 0
      ? answered
      : undefined;
  if (t === undefined) {
    return undefined;
  }
  return {answered: a ?? 0, total: t};
}

/**
 * Maps one API row to `InspectionListItem`. Only uses API fields that exist on the list UI;
 * anything else is filled with the same dummy values as the offline fallback.
 */
export function mapApiInspectionToListItem(dto: ApiInspectionDto): InspectionListItem {
  const id =
    typeof dto.id === 'string' && dto.id.length > 0
      ? dto.id
      : `inspection-${Date.now()}`;

  const title =
    typeof dto.title === 'string' && dto.title.trim().length > 0
      ? dto.title.trim()
      : DUMMY.title;

  const address =
    typeof dto.address === 'string' && dto.address.trim().length > 0
      ? dto.address.trim()
      : DUMMY.address;

  const developer =
    typeof dto.clientName === 'string' && dto.clientName.trim().length > 0
      ? dto.clientName.trim()
      : DUMMY.developer;

  const progress = safeProgress(dto.answeredQuestions, dto.totalQuestions);

  return {
    id,
    timeRange: formatScheduledRange(dto.scheduledStart, dto.scheduledEnd),
    title,
    developer,
    address,
    assignee: DUMMY.assignee,
    status: mapApiStatus(dto.status),
    progress,
  };
}
