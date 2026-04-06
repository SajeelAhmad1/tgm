import AsyncStorage from '@react-native-async-storage/async-storage';
import type {InspectionListItem} from '../components/inspections/InspectionListCard';

const STORAGE_KEY = 'glassmarket-inspections-v1';

export async function loadCachedInspections(): Promise<InspectionListItem[] | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return null;
    }
    return parsed as InspectionListItem[];
  } catch {
    return null;
  }
}

export async function saveCachedInspections(
  items: InspectionListItem[],
): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore persist errors; UI still shows in-memory data */
  }
}
