import {create} from 'zustand';
import type {InspectionListItem} from '../components/inspections/InspectionListCard';
import {FALLBACK_INSPECTION_LIST} from '../inspections/fallbackInspectionList';

type InspectionsListState = {
  items: InspectionListItem[];
  setItems: (items: InspectionListItem[]) => void;
};

export const useInspectionsListStore = create<InspectionsListState>(set => ({
  items: [...FALLBACK_INSPECTION_LIST],
  setItems: items => set({items}),
}));
