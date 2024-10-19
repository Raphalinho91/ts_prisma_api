export interface CreateTenantRequest {
  userId: string;
  name: string;
  path: string;
  url: string;
  iban: string;
}

export interface EditTenantRequest {
  userId: string;
  id: string;
  name: string;
  path: string;
  url: string;
  iban?: string | null;
}

export interface AddInfoPro {
  userId: string;
  id: string;
  email?: string | null;
  phoneNumber?: string | null;
}

export interface AddInfoProReply {
  id: string;
  email?: string | null;
  phoneNumber?: string | null;
}

export interface CreateTenantReply {
  id: string;
  name: string;
  url: string;
  path: string;
  iban: string;
  firstConnection: Boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface VerifyIfTenantcanBeUsedRequest {
  userId?: string | null;
  tenantId: string;
  tenantUrl: string;
}

export interface InfoTenantReply {
  id: string;
  name: string;
  url: string;
  path: string;
  iban: string;
  email?: string | null;
  phoneNumber?: string | null;
  firstConnection: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  productId: string | null;
}
