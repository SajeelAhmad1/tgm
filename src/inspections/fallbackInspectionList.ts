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
