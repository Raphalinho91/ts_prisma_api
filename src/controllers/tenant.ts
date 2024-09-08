import { FastifyRequest, FastifyReply } from "fastify";
import { TenantService } from "../services/tenant";
import { BadRequestsException } from "../utils/request/requestBad";
import { ErrorCode } from "../utils/request/requestError";
import { handleError } from "../utils/error/error";
import { ValidCode } from "../utils/reply/replySend";
import { GoodReplyException } from "../utils/reply/replyGood";
import { CreateTenantReply, CreateTenantRequest } from "../interfaces/tenant";
import { CreateTenantSchema } from "../schemas/tenant";

export const createTenant = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user) {
      throw new BadRequestsException(
        "User not authenticated !",
        ErrorCode.USER_NOT_FOUND
      );
    }

    const userId = request.user.id;
    const validatedData = CreateTenantSchema.parse(
      request.body as CreateTenantRequest
    );

    if (!validatedData.name || !validatedData.path) {
      throw new BadRequestsException(
        "Missing required fields !",
        ErrorCode.BODY_IS_REQUIRED
      );
    }
    const tenantService = new TenantService(request.server.prisma);
    const baseURL = "http://localhost:5051";
    const url = new URL(validatedData.path, baseURL).toString();
    const tenant = await tenantService.findTenantByNameOrPathOrUrl(
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

    const addTenant = await tenantService.createTenant(
      validatedData.name,
      url,
      validatedData.path,
      firstConnection,
      userId
    );

    const newTenant: CreateTenantReply = {
      id: addTenant.id,
      name: addTenant.name,
      url: addTenant.url,
      path: addTenant.path,
      firstConnection: addTenant.firstConnection,
      createdAt: addTenant.createdAt,
      updatedAt: addTenant.updatedAt,
      userId: addTenant.userId,
    };

    reply
      .code(200)
      .send(
        new GoodReplyException(
          "Tenant successfully created",
          ValidCode.USER_SIGN_UP,
          newTenant
        )
      );
  } catch (error) {
    handleError(error, reply);
  }
};
