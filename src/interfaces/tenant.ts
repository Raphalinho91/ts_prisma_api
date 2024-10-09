export interface CreateTenantRequest {
  userId: string;
  name: string;
  path: string;
  url: string;
  iban: string;
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
  tenantId: string;
}
