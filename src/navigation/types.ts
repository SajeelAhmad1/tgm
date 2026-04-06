import type {NavigatorScreenParams} from '@react-navigation/native';

export type MainStackParamList = {
  InspectionList: undefined;
  InspectionDetail: {inspectionId: string};
  CompleteInspection: {inspectionId: string};
  ClientSignature: {inspectionId: string};
  InspectionComplete: {inspectionId: string};
  InspectionReport: {inspectionId: string};
  ReviewListQuestionDetails: {inspectionId: string};
  Login: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  AccountProfile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
