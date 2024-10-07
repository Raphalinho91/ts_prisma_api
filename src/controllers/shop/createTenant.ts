import { CreateTenantReply } from "../../interfaces/tenant";
import { UserService } from "../../services/auth";
import { TenantService } from "../../services/tenant";
import { BadRequestsException } from "../../utils/request/requestBad";
import { ErrorCode } from "../../utils/request/requestError";

export class CreateTenantService {
  private tenantService: TenantService;
  private userService: UserService;

  constructor(tenantService: TenantService, userService: UserService) {
    this.tenantService = tenantService;
    this.userService = userService;
  }

  async createTenant(
    name: string,
    url: string,
    path: string,
    iban: string,
    userId: string | null
  ): Promise<CreateTenantReply> {
    if (!userId) {
      throw new BadRequestsException(
        "User not found !",
        ErrorCode.USER_NOT_FOUND
      );
    }
    const userHasAlreadyTenant = await this.tenantService.findTenantByUserId(
      userId
    );
    if (userHasAlreadyTenant) {
      throw new BadRequestsException(
        "User already has a tenant !",
        ErrorCode.TENANT_ALREADY_EXISTS
      );
    }

    const tenantAlreadyUsed =
      await this.tenantService.findTenantByNameOrPathOrUrl(name, url, path);
    if (tenantAlreadyUsed) {
      throw new BadRequestsException(
        "Name, URL or path already in use !",
        ErrorCode.TENANT_ALREADY_EXISTS
      );
    }

    const firstConnection = false;
    const addTenant = await this.tenantService.createTenant(
      name,
      url,
      path,
      iban,
      firstConnection,
      userId
    );

    const newTenant = await this.tenantService.findTenantById(addTenant.id);

    if (!newTenant) {
      throw new BadRequestsException(
        "Failed to retrieve tenant !",
        ErrorCode.TENANT_NOT_FOUND
      );
    }

    await this.userService.updateUserTenant(userId, newTenant.id);
    await this.userService.updateUserRoleForSeller(userId);

    return {
      id: newTenant.id,
      name: newTenant.name,
      url: newTenant.url,
      path: newTenant.path,
      iban: newTenant.iban,
      firstConnection: newTenant.firstConnection,
      createdAt: newTenant.createdAt,
      updatedAt: newTenant.updatedAt,
      userId: newTenant.userId,
    };
  }
}
