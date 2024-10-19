import { InfoTenantReply } from "../../interfaces/tenant";
import { TenantService } from "../../services/tenant";
import { BadRequestsException } from "../../utils/request/requestBad";
import { ErrorCode } from "../../utils/request/requestError";

export class EditTenantService {
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

  async editTenant(
    id: string,
    name: string,
    path: string,
    url: string,
    iban?: string | null
  ): Promise<InfoTenantReply> {
    const tenant = await this.tenantService.findTenantById(id);

    if (!tenant) {
      throw new BadRequestsException(
        "User does not exist!",
        ErrorCode.USER_NOT_FOUND
      );
    }

    const tenantAlreadyUsed =
      await this.tenantService.findTenantByPathOrNameOrUrl(path, name, url);
    if (tenantAlreadyUsed && tenantAlreadyUsed.id !== tenant.id) {
      throw new BadRequestsException(
        "URL already in use !",
        ErrorCode.TENANT_ALREADY_EXISTS
      );
    }

    const editTenant = await this.tenantService.updateTenant(
      tenant.id,
      name,
      path,
      url,
      iban
    );

    const newTenant = await this.tenantService.findTenantById(editTenant.id);

    if (!newTenant) {
      throw new BadRequestsException(
        "Failed to retrieve tenant !",
        ErrorCode.TENANT_NOT_FOUND
      );
    }

    return {
      id: newTenant.id,
      name: newTenant.name,
      url: newTenant.url,
      path: newTenant.path,
      iban: this.formatIban(tenant.iban),
      email: tenant.email,
      phoneNumber: tenant.phoneNumber,
      firstConnection: newTenant.firstConnection,
      createdAt: new Date(newTenant.createdAt),
      updatedAt: newTenant.updatedAt,
      userId: newTenant.userId,
      productId: newTenant.productId,
    };
  }
}
