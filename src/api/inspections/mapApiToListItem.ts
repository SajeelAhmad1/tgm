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

  const progress = safeProgress(dto.answeredQuestions, dto.totalQuestions);

  return {
    id,
    timeRange: DUMMY.timeRange,
    title,
    developer: DUMMY.developer,
    address,
    assignee: DUMMY.assignee,
    status: mapApiStatus(dto.status),
    progress,
  };
}
