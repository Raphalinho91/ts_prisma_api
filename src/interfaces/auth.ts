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

export interface InfoUserReply {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string | null;
  region: string | null;
  postalCode: string | null;
  city: string | null;
  addressOne: string | null;
  addressTwo: string | null;
  acceptTermsOfUse: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  tenantId: string | null;
  productId: string | null;
}

export interface EditUserLocationRequestAndReply {
  id: string;
  country?: string | null;
  region?: string | null;
  postalCode?: string | null;
  city?: string | null;
  addressOne?: string | null;
  addressTwo?: string | null;
}
