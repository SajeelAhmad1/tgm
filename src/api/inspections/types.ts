export type ApiInspectionStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | string;

export type ApiInspectionDto = {
  id: string;
  title?: string;
  address?: string;
  clientName?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  status?: ApiInspectionStatus;
  itemCount?: number;
  completedItemCount?: number;
  totalQuestions?: number;
  answeredQuestions?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiInspectionItemDto = {
  id: string;
  name?: string;
  description?: string | null;
  qty?: number | null;
  status?: string;
  questionCount?: number;
  answeredCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiInspectionAssigneeDto = {
  id: string;
  name?: string;
  email?: string;
};

export type ApiInspectionQuestionAnswerDto = {
  id: string;
  value?: string | null;
  severity?: string | null;
  comment?: string | null;
  aiPolishedComment?: string | null;
  aiProcessed?: boolean;
  questionId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiInspectionQuestionPhotoDto = {
  id?: string;
  s3Url?: string;
  s3Key?: string;
  signedUrl?: string;
  presignedUrl?: string;
  url?: string;
  photoUrl?: string;
  imageUrl?: string;
  [key: string]: unknown;
};

export type ApiInspectionQuestionDto = {
  id: string;
  text?: string;
  guidance?: string | null;
  phase?: string | null;
  sortOrder?: number;
  itemId?: string;
  createdAt?: string;
  updatedAt?: string;
  answer?: ApiInspectionQuestionAnswerDto | null;
  photos?: ApiInspectionQuestionPhotoDto[];
};

export type ApiInspectionDetailDto = {
  id: string;
  title?: string;
  address?: string;
  clientName?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  status?: ApiInspectionStatus;
  assignedTo?: ApiInspectionAssigneeDto | null;
  items?: ApiInspectionItemDto[];
  totalQuestions?: number;
  answeredQuestions?: number;
  noIssuesCount?: number;
  issuesDetectedCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type InspectionsListResponseBody = {
  success: boolean;
  data?: {
    inspections?: ApiInspectionDto[];
  };
};
