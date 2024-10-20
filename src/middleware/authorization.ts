import { FastifyReply, FastifyRequest } from "fastify";
import { JWT_SECRET } from "../secrets";
import * as jwt from "jsonwebtoken";
import { BadRequestsException } from "../utils/request/requestBad";
import { ErrorCode } from "../utils/request/requestError";
import { UserService } from "../services/auth";
import { VerifyIfTenantcanBeUsedRequest } from "../interfaces/tenant";
import { TenantService } from "../services/tenant";
import { handleError } from "../utils/error/error";
import { SessionService } from "../services/session";
import { VerifyIfTenantcanBeUsedSchema } from "../schemas/tenant";

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
    const sessionService = new SessionService(request.server.prisma);
    const session = await sessionService.findSessionByToken(token);
    if (!session) {
      throw new BadRequestsException("Invalid token", ErrorCode.INVALID_TOKEN);
    }
    const userService = new UserService(request.server.prisma);
    const user = await userService.findUserById(decodedToken.userId);
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
    const validatedData = VerifyIfTenantcanBeUsedSchema.parse(
      request.query as VerifyIfTenantcanBeUsedRequest
    );

    const tenantService = new TenantService(request.server.prisma);
    const tenantIdValid = await tenantService.findTenantById(
      validatedData.tenantId
    );
    const tenantUrlValid = await tenantService.findTenantByUrl(
      validatedData.tenantUrl
    );

    if (!tenantIdValid || !tenantUrlValid) {
      throw new BadRequestsException(
        "Tenant not found !",
        ErrorCode.TENANT_NOT_FOUND
      );
    }

    if (
      tenantIdValid.firstConnection ||
      (validatedData.userId && validatedData.userId === tenantIdValid.userId)
    ) {
      request.tenant = tenantIdValid;
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
