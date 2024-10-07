export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptTermsOfUse: boolean;
}

export interface SignUpReply {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  acceptTermsOfUse: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogInRequest {
  email: string;
  password: string;
}

export interface LogInReply {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  token: string;
}
