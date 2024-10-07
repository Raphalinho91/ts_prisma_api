import { FastifyRequest, FastifyReply } from "fastify";
import { CreateTenantRequest } from "../../interfaces/tenant";
import { TenantService } from "../../services/tenant";
import { UserService } from "../../services/auth";
import { CreateTenantSchema } from "../../schemas/tenant";
import { GoodReplyException } from "../../utils/reply/replyGood";
import { handleError } from "../../utils/error/error";
import { ValidCode } from "../../utils/reply/replySend";
import { CreateTenantService } from "./createTenant";

export const createShop = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const validatedData = CreateTenantSchema.parse(
      request.body as CreateTenantRequest
    );
    const userId = request.user?.id as string | null;
    const userService = new UserService(request.server.prisma);
    const tenantService = new TenantService(request.server.prisma);
    const shopService = new CreateTenantService(tenantService, userService);
    const shopReply = await shopService.createTenant(
      validatedData.name,
      validatedData.path,
      validatedData.url,
      validatedData.iban,
      userId
    );

    reply
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
