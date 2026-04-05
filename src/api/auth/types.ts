export type AuthUserDto = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type LoginSuccessData = {
  user: AuthUserDto;
  token: string;
  refreshToken: string;
};

export type LoginResponseBody =
  | {
      success: true;
      data: LoginSuccessData;
    }
  | {
      success: false;
      message?: string;
      error?: string;
    };
