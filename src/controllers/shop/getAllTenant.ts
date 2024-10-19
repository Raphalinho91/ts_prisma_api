import { TenantService } from "../../services/tenant";

export class GetAllTenantService {
  private tenantService: TenantService;

  constructor(tenantService: TenantService) {
    this.tenantService = tenantService;
  }

  async getAllTenant(): Promise<{ url: string; name: string; path: string }[]> {
    const allUrl = await this.tenantService.findAllTenant();
    return allUrl;
  }
}
