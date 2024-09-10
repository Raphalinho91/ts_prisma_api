import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import {
  CreateTenantReply,
  CreateTenantRequest,
} from "../../interfaces/tenant";
import { TenantService } from "../../services/tenant";
import { UserService } from "../../services/auth";
import { BadRequestsException } from "../../utils/request/requestBad";
import { CreateTenantSchema } from "../../schemas/tenant";
import { ErrorCode } from "../../utils/request/requestError";
import { GoodReplyException } from "../../utils/reply/replyGood";
import { handleError } from "../../utils/error/error";
import { ValidCode } from "../../utils/reply/replySend";

interface ITenantCreator {
  createTenant(
    request: CreateTenantRequest,
    userId: string
  ): Promise<CreateTenantReply>;
}

class TenantCreator implements ITenantCreator {
  constructor(
    private tenantService: TenantService,
    private userService: UserService
  ) {}

  async createTenant(
    request: CreateTenantRequest,
    userId: string
  ): Promise<CreateTenantReply> {
    const existingTenant = await this.tenantService.findTenantByUserId(userId);
    if (existingTenant) {
      throw new BadRequestsException(
        "User already has a tenant !",
        ErrorCode.TENANT_ALREADY_EXISTS
      );
    }

    const validatedData = CreateTenantSchema.parse(request);
    if (!validatedData.name || !validatedData.path) {
      throw new BadRequestsException(
        "Missing required fields !",
        ErrorCode.BODY_IS_REQUIRED
      );
    }

    const baseURL = "http://localhost:5051";
    const url = new URL(validatedData.path, baseURL).toString();
    const tenant = await this.tenantService.findTenantByNameOrPathOrUrl(
      validatedData.name,
      url,
      validatedData.path
    );

    if (tenant) {
      throw new BadRequestsException(
        "Name, URL or path already in use !",
        ErrorCode.TENANT_ALREADY_EXISTS
      );
    }

    const firstConnection = false;
    const addTenant = await this.tenantService.createTenant(
      validatedData.name,
      url,
      validatedData.path,
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
      firstConnection: newTenant.firstConnection,
      createdAt: newTenant.createdAt,
      updatedAt: newTenant.updatedAt,
      userId: newTenant.userId,
    };
  }
}

export const createTenant = (server: FastifyInstance) => {
  const tenantService = new TenantService(server.prisma);
  const userService = new UserService(server.prisma);
  const tenantCreator = new TenantCreator(tenantService, userService);

  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        throw new BadRequestsException(
          "User not authenticated !",
          ErrorCode.USER_NOT_FOUND
        );
      }

      const userId = request.user.id;
      const tenantRequest = request.body as CreateTenantRequest;
      const tenantReply = await tenantCreator.createTenant(
        tenantRequest,
        userId
      );

      reply
        .code(200)
        .send(
          new GoodReplyException(
            "Tenant successfully created",
            ValidCode.TENANT_CREATED,
            tenantReply
          )
        );
    } catch (error) {
      handleError(error, reply);
    }
  };
};
