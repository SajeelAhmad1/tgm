import type {InspectionListItem} from '../components/inspections/InspectionListCard';
import type {InspectionCardStatus} from '../components/inspections/InspectionStatusBadge';

export type InspectionOverviewDetail = {
  inspectionType: string;
  category: string;
  statusLabel: string;
  dateLabel: string;
  issuesItemCount: number;
};

export type InspectionBundle = {
  list: InspectionListItem;
  detail: InspectionOverviewDetail;
};

const DUMMY_DETAIL: InspectionOverviewDetail = {
  inspectionType: 'Detailed Product Walkthrough',
  category: 'Client Sign-Off',
  statusLabel: 'Scheduled',
  dateLabel: '16 March 2026',
  issuesItemCount: 0,
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
 * Builds overview tab data from the same fields used on the list card.
 * Extra overview-only copy uses safe defaults when the API does not provide it.
 */
export function buildInspectionOverviewBundle(
  list: InspectionListItem,
): InspectionBundle {
  return {
    list,
    detail: {
      ...DUMMY_DETAIL,
      statusLabel: statusToOverviewLabel(list.status),
    },
  };
}
