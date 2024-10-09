import { FastifyRequest, FastifyReply } from "fastify";
import { CreateTenantRequest } from "../../interfaces/tenant";
import { TenantService } from "../../services/tenant";
import { UserService } from "../../services/auth";
import { CreateTenantSchema } from "../../schemas/tenant";
import { GoodReplyException } from "../../utils/reply/replyGood";
import { handleError } from "../../utils/error/error";
import { ValidCode } from "../../utils/reply/replySend";
import { CreateTenantService } from "./createTenant";
import { BadRequestsException } from "../../utils/request/requestBad";
import { ErrorCode } from "../../utils/request/requestError";
import { GetAllTenantService } from "./getAllTenant";

export const createShop = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user || request.user === undefined) {
      throw new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    const validatedData = CreateTenantSchema.parse(
      request.body as CreateTenantRequest
    );
    if (request.user.id !== validatedData.userId) {
      throw new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    const urlValid = `https://${validatedData.name}.koabuy.fr/v1/${validatedData.path}`;
    if (urlValid !== validatedData.url) {
      throw new BadRequestsException(
        "Url not correspond",
        ErrorCode.TENANT_CANNOT_BE_USED
      );
    }
    const userService = new UserService(request.server.prisma);
    const tenantService = new TenantService(request.server.prisma);
    const shopService = new CreateTenantService(tenantService, userService);
    const shopReply = await shopService.createTenant(
      validatedData.userId,
      validatedData.name,
      validatedData.path,
      validatedData.url,
      validatedData.iban
    );

    await reply
      .code(200)
      .send(
        new GoodReplyException(
          "Shop created with successfully",
          ValidCode.TENANT_CREATED,
          shopReply
        )
      );
  } catch (error) {
    handleError(error, reply);
  }
};

export const getAllShop = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const tenantService = new TenantService(request.server.prisma);
    const shopService = new GetAllTenantService(tenantService);
    const shopReply = await shopService.getAllTenant();

    await reply
      .code(200)
      .send(
        new GoodReplyException(
          "Shop created with successfully",
          ValidCode.TENANT_CREATED,
          shopReply
        )
      );
  } catch (error) {
    handleError(error, reply);
  }
};
