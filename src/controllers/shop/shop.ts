import { FastifyRequest, FastifyReply } from "fastify";
import {
  AddInfoPro,
  CreateTenantRequest,
  EditTenantRequest,
} from "../../interfaces/tenant";
import { TenantService } from "../../services/tenant";
import { UserService } from "../../services/auth";
import {
  AddContactProTenantSchema,
  CreateTenantSchema,
  EditTenantSchema,
} from "../../schemas/tenant";
import { GoodReplyException } from "../../utils/reply/replyGood";
import { handleError } from "../../utils/error/error";
import { ValidCode } from "../../utils/reply/replySend";
import { CreateTenantService } from "./createTenant";
import { BadRequestsException } from "../../utils/request/requestBad";
import { ErrorCode } from "../../utils/request/requestError";
import { GetAllTenantService } from "./getAllTenant";
import { GetOneTenantService } from "./getOneTenant";
import { addInfoProTenantService } from "./addInfoProTenant";
import { EditTenantService } from "./EditTenant";

export const postShop = async (
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
    const urlValid = `https://koabuy.onrender.com/v1/${validatedData.name}/${validatedData.path}`;
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
          "Shop fetch with successfully",
          ValidCode.TENANT_CREATED,
          shopReply
        )
      );
  } catch (error) {
    handleError(error, reply);
  }
};

export const getOneShop = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.tenant || request.tenant === undefined) {
      throw new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    const tenantService = new TenantService(request.server.prisma);
    const shopService = new GetOneTenantService(tenantService);
    const shopReply = await shopService.getOneTenant(request.tenant?.id);

    await reply
      .code(200)
      .send(
        new GoodReplyException(
          "Shop fetch with successfully",
          ValidCode.TENANT_CREATED,
          shopReply
        )
      );
  } catch (error) {
    handleError(error, reply);
  }
};

export const getShop = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    if (!request.user || request.user === undefined) {
      throw new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    if (!request.user.tenantId || request.user.tenantId === undefined) {
      throw new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    const tenantService = new TenantService(request.server.prisma);
    const shopService = new GetOneTenantService(tenantService);
    const shopReply = await shopService.getOneTenant(request.user.tenantId);

    await reply
      .code(200)
      .send(
        new GoodReplyException(
          "Shop fetch with successfully",
          ValidCode.TENANT_CREATED,
          shopReply
        )
      );
  } catch (error) {
    handleError(error, reply);
  }
};

export const putShop = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    if (!request.user || request.user === undefined) {
      throw new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    const validatedData = EditTenantSchema.parse(
      request.body as EditTenantRequest
    );
    if (request.user.id !== validatedData.userId) {
      throw new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    const urlValid = `https://koabuy.onrender.com/v1/${validatedData.name}/${validatedData.path}`;
    if (urlValid !== validatedData.url) {
      throw new BadRequestsException(
        "Url not correspond",
        ErrorCode.TENANT_CANNOT_BE_USED
      );
    }
    const tenantService = new TenantService(request.server.prisma);
    const shopService = new EditTenantService(tenantService);
    const shopReply = await shopService.editTenant(
      validatedData.id,
      validatedData.name,
      validatedData.path,
      validatedData.url,
      validatedData.iban
    );

    await reply
      .code(200)
      .send(
        new GoodReplyException(
          "Shop edited with successfully",
          ValidCode.TENANT_CREATED,
          shopReply
        )
      );
  } catch (error) {
    handleError(error, reply);
  }
};

export const postShopPro = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user || request.user === undefined) {
      throw new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    const validatedData = AddContactProTenantSchema.parse(
      request.body as AddInfoPro
    );
    if (request.user.id !== validatedData.userId) {
      throw new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    const tenantService = new TenantService(request.server.prisma);
    const shopService = new addInfoProTenantService(tenantService);
    const shopReply = await shopService.addInfoProTenant(
      validatedData.id,
      validatedData.email,
      validatedData.phoneNumber
    );

    await reply
      .code(200)
      .send(
        new GoodReplyException(
          "Shop fetch with successfully",
          ValidCode.TENANT_CREATED,
          shopReply
        )
      );
  } catch (error) {
    handleError(error, reply);
  }
};
