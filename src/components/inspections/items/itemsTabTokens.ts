export type ItemRowStatus = 'Issues' | 'No Issues' | 'In Progress' | 'Not Assessed';

export type FilterType = 'All' | ItemRowStatus;

export const ITEM_FILTERS: FilterType[] = [
  'All',
  'No Issues',
  'In Progress',
  'Issues',
  'Not Assessed',
];

export const ITEM_STATUS_CONFIG: Record<
  ItemRowStatus,
  {dot: string; badgeBg: string; badgeText: string; label: string}
> = {
  Issues: {dot: '#DC2626', badgeBg: '#FEE2E2', badgeText: '#DC2626', label: 'Issues'},
  'No Issues': {dot: '#16A34A', badgeBg: '#DCFCE7', badgeText: '#16A34A', label: 'No Issues'},
  'In Progress': {dot: '#D97706', badgeBg: '#FEF3C7', badgeText: '#D97706', label: 'In Progress'},
  'Not Assessed': {dot: '#64748B', badgeBg: '#F1F5F9', badgeText: '#64748B', label: 'Not Assessed'},
};

export const ITEM_FILTER_CHIP_STYLES: Record<
  FilterType,
  {activeBg: string; activeText: string; inactiveBg: string; inactiveText: string}
> = {
  All: {activeBg: '#2091F9', activeText: '#FFFFFF', inactiveBg: '#F1F5F9', inactiveText: '#64748B'},
  'No Issues': {activeBg: '#16A34A', activeText: '#FFFFFF', inactiveBg: '#DCFCE7', inactiveText: '#16A34A'},
  'In Progress': {activeBg: '#D97706', activeText: '#FFFFFF', inactiveBg: '#FEF3C7', inactiveText: '#D97706'},
  Issues: {activeBg: '#DC2626', activeText: '#FFFFFF', inactiveBg: '#FEE2E2', inactiveText: '#DC2626'},
  'Not Assessed': {activeBg: '#2091F9', activeText: '#FFFFFF', inactiveBg: '#F1F5F9', inactiveText: '#64748B'},
};

export type InspectionItemRow = {
  id: string;
  name: string;
  questionsAnswered: number;
  questionsTotal: number;
  status: ItemRowStatus;
};

export function getItemSubtitle(item: InspectionItemRow): string {
  const base = `${item.questionsAnswered} / ${item.questionsTotal} Questions`;
  switch (item.status) {
    case 'Issues':
      return `${base} · Issues Detected`;
    case 'No Issues':
      return `${base} · No Issues`;
    case 'In Progress':
      return `${base} Completed`;
    case 'Not Assessed':
      return base;
  }
}
