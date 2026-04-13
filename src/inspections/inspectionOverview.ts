import type {InspectionListItem} from '../components/inspections/InspectionListCard';
import type {InspectionCardStatus} from '../components/inspections/InspectionStatusBadge';

export type InspectionOverviewDetail = {
  inspectionType: string;
  category: string;
  statusLabel: string;
  dateLabel: string;
  timeWindowLabel: string;
  issuesItemCount: number;
};

export type InspectionBundle = {
  list: InspectionListItem;
  detail: InspectionOverviewDetail;
};

function statusToOverviewLabel(status: InspectionCardStatus): string {
  switch (status) {
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    default:
      return 'Scheduled';
  }
}

/**
 * Builds overview tab data from API-backed fields already present in list/detail payloads.
 */
export function buildInspectionOverviewBundle(
  list: InspectionListItem,
  overrides?: Partial<InspectionOverviewDetail>,
): InspectionBundle {
  const inspectionType = overrides?.inspectionType?.trim() || 'N/A';
  const category = overrides?.category?.trim() || 'N/A';
  const dateLabel = overrides?.dateLabel?.trim() || '—';
  const timeWindowLabel = overrides?.timeWindowLabel?.trim() || 'N/A';
  const issuesItemCount = Math.max(0, overrides?.issuesItemCount ?? 0);

  return {
    list,
    detail: {
      inspectionType: overrides?.inspectionType ?? inspectionType,
      category: overrides?.category ?? category,
      statusLabel: statusToOverviewLabel(list.status),
      dateLabel,
      timeWindowLabel,
      issuesItemCount,
    },
  };
}
