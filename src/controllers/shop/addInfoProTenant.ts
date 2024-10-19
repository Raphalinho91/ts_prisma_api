import { AddInfoProReply } from "../../interfaces/tenant";
import { TenantService } from "../../services/tenant";
import { BadRequestsException } from "../../utils/request/requestBad";
import { ErrorCode } from "../../utils/request/requestError";

export class addInfoProTenantService {
  private tenantService: TenantService;

  constructor(tenantService: TenantService) {
    this.tenantService = tenantService;
  }

  async addInfoProTenant(
    id: string,
    email?: string | null,
    phoneNumber?: string | null
  ): Promise<AddInfoProReply> {
    const tenant = await this.tenantService.findTenantById(id);

    if (!tenant) {
      throw new BadRequestsException(
        "User does not exist!",
        ErrorCode.USER_NOT_FOUND
      );
    }

    const addInfoProTenant = await this.tenantService.updateInfoProTenant(
      tenant.id,
      email,
      phoneNumber
    );

    return {
      id: addInfoProTenant.id,
      email: addInfoProTenant.email,
      phoneNumber: addInfoProTenant.phoneNumber,
    };
  }
}
