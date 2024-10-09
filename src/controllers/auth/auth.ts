import { FastifyReply, FastifyRequest } from "fastify";
import {
  EditPasswordSchema,
  EditUserInfoSchema,
  EditUserLocationSchema,
  InfoUserSchema,
  LogInSchema,
  SignUpSchema,
} from "../../schemas/auth";
import { handleError } from "../../utils/error/error";
import { GoodReplyException } from "../../utils/reply/replyGood";
import { ValidCode } from "../../utils/reply/replySend";
import { UserService } from "../../services/auth";
import {
  EditUserInfoRequestAndReply,
  EditUserLocationRequestAndReply,
  EditUserPasswordRequest,
  LogInRequest,
  SignUpRequest,
} from "../../interfaces/auth";
import { LogInService } from "./login";
import { SignUpService } from "./signup";
import { InfoUserService } from "./infoUser";
import { BadRequestsException } from "../../utils/request/requestBad";
import { ErrorCode } from "../../utils/request/requestError";
import { EditUserLocationService } from "./editUserLocation";
import { SessionService } from "../../services/session";
import { EditUserInfoService } from "./editUserInfo";
import { EditUserPasswordService } from "./editUserPassword";

export const login = async (
  request: FastifyRequest<{ Body: LogInRequest }>,
  reply: FastifyReply
) => {
  try {
    const validatedData = LogInSchema.parse(request.body);
    const userService = new UserService(request.server.prisma);
    const sessionService = new SessionService(request.server.prisma);
    const authService = new LogInService(userService, sessionService);
    const logInReply = await authService.login(
      validatedData.email,
      validatedData.password
    );

    await reply
      .code(200)
      .send(
        new GoodReplyException(
          "User logged in successfully",
          ValidCode.USER_LOG_IN,
          logInReply
        )
      );
  } catch (error) {
    handleError(error, reply);
  }
};

export const signup = async (
  request: FastifyRequest<{ Body: SignUpRequest }>,
  reply: FastifyReply
) => {
  try {
    const validatedData = SignUpSchema.parse(request.body);
    const userService = new UserService(request.server.prisma);
    const authService = new SignUpService(userService);
    const signUpReply = await authService.signUp(validatedData);

    await reply
      .code(200)
      .send(
        new GoodReplyException(
          "User successfully signed up",
          ValidCode.USER_SIGN_UP,
          signUpReply
        )
      );
  } catch (error) {
    handleError(error, reply);
  }
};

export const infoUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user || request.user === undefined) {
      throw new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    const validatedData = InfoUserSchema.parse({ id: request.user.id });
    const userService = new UserService(request.server.prisma);
    const authService = new InfoUserService(userService);
    const infoUserReply = await authService.infoUser(validatedData.id);

    await reply
      .code(200)
      .send(
        new GoodReplyException(
          "User information fetched successfully",
          ValidCode.USER_FETCHED,
          infoUserReply
        )
      );
  } catch (error) {
    handleError(error, reply);
  }
};

export const editUserLocation = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user || request.user === undefined) {
      throw new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    const validatedData = EditUserLocationSchema.parse(
      request.body as EditUserLocationRequestAndReply
    );
    if (request.user.id !== validatedData.id) {
      throw new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    const userService = new UserService(request.server.prisma);
    const authService = new EditUserLocationService(userService);
    const editUserLocationReply = await authService.editUserLocation(
      validatedData
    );

    await reply
      .code(200)
      .send(
        new GoodReplyException(
          "User successfully edited",
          ValidCode.USER_EDIT,
          editUserLocationReply
        )
      );
  } catch (error) {
    handleError(error, reply);
  }
};

export const editUserInfo = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user || request.user === undefined) {
      throw new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    const validatedData = EditUserInfoSchema.parse(
      request.body as EditUserInfoRequestAndReply
    );
    if (request.user.id !== validatedData.id) {
      throw new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    const userService = new UserService(request.server.prisma);
    const authService = new EditUserInfoService(userService);
    const editUserInfoReply = await authService.editUserInfo(validatedData);

    await reply
      .code(200)
      .send(
        new GoodReplyException(
          "User successfully edited",
          ValidCode.USER_EDIT,
          editUserInfoReply
        )
      );
  } catch (error) {
    handleError(error, reply);
  }
};

export const editUserPassword = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user || request.user === undefined) {
      throw new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    const validatedData = EditPasswordSchema.parse(
      request.body as EditUserPasswordRequest
    );
    if (request.user.id !== validatedData.id) {
      throw new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    if (validatedData.newPassword !== validatedData.confirmPassword) {
      throw new BadRequestsException(
        "New password and confirm password not correspond",
        ErrorCode.INCORRECT_PASSWORD
      );
    }
    const userService = new UserService(request.server.prisma);
    const authService = new EditUserPasswordService(userService);
    await authService.editUserPassword(validatedData);

    await reply
      .code(200)
      .send(
        new GoodReplyException("User successfully edited", ValidCode.USER_EDIT)
      );
  } catch (error) {
    handleError(error, reply);
  }
};
