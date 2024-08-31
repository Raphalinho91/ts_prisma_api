export interface CreateTenantRequest {
  name: string;
  path: string;
}

export interface CreateTenantReply {
  id: string;
  name: string;
  url: string;
  path: string;
  firstConnection: Boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface VerifyIfTenantcanBeUsedRequest {
  tenantId: string;
}
