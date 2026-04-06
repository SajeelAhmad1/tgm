import {create} from 'zustand';
import type {InspectionListItem} from '../components/inspections/InspectionListCard';

type InspectionsListState = {
  items: InspectionListItem[];
  setItems: (items: InspectionListItem[]) => void;
};

export const useInspectionsListStore = create<InspectionsListState>(set => ({
  items: [],
  setItems: items => set({items}),
}));
