import type {InspectionListItem} from '../../components/inspections/InspectionListCard';

export const MOCK_INSPECTIONS: InspectionListItem[] = [
  {
    id: '1',
    timeRange: '9:00 AM – 11:30 AM',
    title: 'Bay View Apartments',
    developer: 'Bayside Development',
    address: '142 Marine Parade, Brighton',
    assignee: 'James Mitchell',
    status: 'in_progress',
    progress: {answered: 18, total: 20},
  },
  {
    id: '2',
    timeRange: '1:00 PM – 2:30 PM',
    title: 'Harbour Heights',
    developer: 'Harbour Views',
    address: '56 Dock Street, Waterloo',
    assignee: 'James Mitchell',
    status: 'scheduled',
  },
  {
    id: '3',
    timeRange: '3:00 PM – 4:00 PM',
    title: 'City Central Tower',
    developer: 'Central Precinct',
    address: '88 Collins Street, Melbourne',
    assignee: 'James Mitchell',
    status: 'scheduled',
  },
];

export type InspectionOverviewDetail = {
  inspectionType: string;
  category: string;
  statusLabel: string;
  dateLabel: string;
  issuesItemCount: number;
};

const DEFAULT_DETAIL: InspectionOverviewDetail = {
  inspectionType: '—',
  category: '—',
  statusLabel: 'Scheduled',
  dateLabel: '—',
  issuesItemCount: 0,
};

const DETAILS_BY_ID: Record<string, InspectionOverviewDetail> = {
  '1': {
    inspectionType: 'Detailed Product Walkthrough',
    category: 'Client Sign-Off',
    statusLabel: 'In Progress',
    dateLabel: '16 March 2026',
    issuesItemCount: 2,
  },
  '2': {
    inspectionType: 'Facade inspection',
    category: 'Residential',
    statusLabel: 'Scheduled',
    dateLabel: '17 March 2026',
    issuesItemCount: 0,
  },
  '3': {
    inspectionType: 'Tower compliance review',
    category: 'Commercial',
    statusLabel: 'Scheduled',
    dateLabel: '18 March 2026',
    issuesItemCount: 0,
  },
};

export function getInspectionById(id: string): InspectionListItem | undefined {
  return MOCK_INSPECTIONS.find(x => x.id === id);
}

export function getInspectionOverviewDetail(id: string): {
  list: InspectionListItem;
  detail: InspectionOverviewDetail;
} | null {
  const list = getInspectionById(id);
  if (!list) {
    return null;
  }
  const detail = DETAILS_BY_ID[id] ?? DEFAULT_DETAIL;
  return {list, detail};
}
