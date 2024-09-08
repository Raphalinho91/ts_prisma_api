import { FastifyReply, FastifyRequest } from "fastify";
import { JWT_SECRET } from "../secrets";
import * as jwt from "jsonwebtoken";
import { BadRequestsException } from "../utils/request/requestBad";
import { ErrorCode } from "../utils/request/requestError";
import { UserService } from "../services/auth";
import { VerifyIfTenantcanBeUsedRequest } from "../interfaces/tenant";
import { TenantService } from "../services/tenant";
import { handleError } from "../utils/error/error";

interface JwtPayloadWithId extends jwt.JwtPayload {
  id: string;
}

export const authMiddleware = async (request: FastifyRequest) => {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token || token === undefined) {
    throw new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED);
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayloadWithId;
    const userService = new UserService(request.server.prisma);
    const user = await userService.findUserById(decodedToken.id);
    if (!user) {
      throw new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    request.user = user;
  } catch (error) {
    throw new BadRequestsException("Invalid token", ErrorCode.INVALID_TOKEN);
  }
};

export const verifyIfTenantcanBeUsed = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { tenantId } = request.query as VerifyIfTenantcanBeUsedRequest;
    if (tenantId === undefined) {
      throw new BadRequestsException(
        "Tenant not found !",
        ErrorCode.TENANT_NOT_FOUND
      );
    }
    const tenantService = new TenantService(request.server.prisma);
    const tenant = await tenantService.findTenantById(tenantId);

    if (!tenant) {
      throw new BadRequestsException(
        "Tenant not found !",
        ErrorCode.TENANT_NOT_FOUND
      );
    }

    const userId = request.user?.id;

    if (tenant.firstConnection || (userId && userId === tenant.userId)) {
      request.tenant = tenant;
    } else {
      throw new BadRequestsException(
        "User is not authorized to use the application at this time!",
        ErrorCode.TENANT_CANNOT_BE_USED
      );
    }
  } catch (error) {
    handleError(error, reply);
  }
};
