import type {InspectionItemRow} from '../../components/inspections/items/itemsTabTokens';

export const MOCK_INSPECTION_ITEMS: InspectionItemRow[] = [
  {id: 'item-1', name: 'Balcony Door – Unit 1', questionsAnswered: 2, questionsTotal: 5, status: 'Issues'},
  {id: 'item-2', name: 'Kitchen Window – U', questionsAnswered: 5, questionsTotal: 5, status: 'No Issues'},
  {id: 'item-3', name: 'Living Room – Unit', questionsAnswered: 3, questionsTotal: 5, status: 'In Progress'},
  {id: 'item-4', name: 'Living Room – Unit 2', questionsAnswered: 5, questionsTotal: 5, status: 'No Issues'},
  {id: 'item-5', name: 'Master Bedroom', questionsAnswered: 0, questionsTotal: 5, status: 'Not Assessed'},
];
