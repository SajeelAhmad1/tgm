import type {InspectionListItem} from '../components/inspections/InspectionListCard';

/** When an inspection id is not in the list cache (e.g. cold open). Same shape as list cards. */
export function buildPlaceholderListItem(inspectionId: string): InspectionListItem {
  return {
    id: inspectionId,
    timeRange: '9:00 AM – 11:30 AM',
    title: 'Inspection',
    developer: 'Bayside Development',
    address: '—',
    assignee: 'James Mitchell',
    status: 'scheduled',
  };
}

/** Shown when the API fails, returns empty, or omits usable data. Keeps list UI unchanged. */
export const FALLBACK_INSPECTION_LIST: InspectionListItem[] = [
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
