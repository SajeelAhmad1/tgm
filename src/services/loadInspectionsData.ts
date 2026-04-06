import NetInfo from '@react-native-community/netinfo';
import type {InspectionListItem} from '../components/inspections/InspectionListCard';
import {requestInspectionsFromNetwork} from '../api/inspections/requestInspectionsFromNetwork';
import {FALLBACK_INSPECTION_LIST} from '../inspections/fallbackInspectionList';
import {
  loadCachedInspections,
  saveCachedInspections,
} from '../storage/inspectionsCache';

export type LoadInspectionsResult = {
  items: InspectionListItem[];
  error: string | null;
};

function canUseNetwork(state: {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
}): boolean {
  if (state.isConnected !== true) {
    return false;
  }
  if (state.isInternetReachable === false) {
    return false;
  }
  return true;
}

/**
 * Loads inspections: uses network when available (persists on success),
 * otherwise local cache, otherwise sample fallback list.
 */
export async function loadInspectionsData(): Promise<LoadInspectionsResult> {
  const cached = await loadCachedInspections();
  const netState = await NetInfo.fetch();

  if (!canUseNetwork(netState)) {
    if (cached && cached.length > 0) {
      return {
        items: cached,
        error: 'Offline — showing saved inspections.',
      };
    }
    return {
      items: [...FALLBACK_INSPECTION_LIST],
      error: 'Offline — no saved data. Showing sample inspections.',
    };
  }

  const remote = await requestInspectionsFromNetwork();
  if (remote.ok) {
    await saveCachedInspections(remote.items);
    return {items: remote.items, error: null};
  }

  if (cached && cached.length > 0) {
    return {items: cached, error: remote.error};
  }

  return {
    items: [...FALLBACK_INSPECTION_LIST],
    error: remote.error,
  };
}
