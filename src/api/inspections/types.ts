export type ApiInspectionStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | string;

export type ApiInspectionDto = {
  id: string;
  title?: string;
  address?: string;
  status?: ApiInspectionStatus;
  itemCount?: number;
  completedItemCount?: number;
  totalQuestions?: number;
  answeredQuestions?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type InspectionsListResponseBody = {
  success: boolean;
  data?: {
    inspections?: ApiInspectionDto[];
  };
};
