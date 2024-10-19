import { InfoTenantReply } from "../../interfaces/tenant";
import { TenantService } from "../../services/tenant";
import { BadRequestsException } from "../../utils/request/requestBad";
import { ErrorCode } from "../../utils/request/requestError";

export class GetOneTenantService {
  private tenantService: TenantService;

  constructor(tenantService: TenantService) {
    this.tenantService = tenantService;
  }

  private formatIban(iban: string): string {
    if (iban.length >= 8) {
      const prefix = iban.substring(0, 6);
      const lastFourDigits = iban.slice(-4);
      const formattedIban = `${prefix}XXXX XXXX XXXX XXXX XXXX${lastFourDigits}`;
      return formattedIban;
    }
    return iban;
  }

  async getOneTenant(id: string): Promise<InfoTenantReply> {
    const tenant = await this.tenantService.findTenantById(id);

    if (!tenant) {
      throw new BadRequestsException(
        "Tenant does not exist!",
        ErrorCode.TENANT_NOT_FOUND
      );
    }

    return {
      id: tenant.id,
      name: tenant.name,
      url: tenant.url,
      path: tenant.path,
      iban: this.formatIban(tenant.iban),
      email: tenant.email,
      phoneNumber: tenant.phoneNumber,
      firstConnection: tenant.firstConnection,
      createdAt: new Date(tenant.createdAt),
      updatedAt: tenant.updatedAt,
      userId: tenant.userId,
      productId: tenant.productId,
    };
  }
}
