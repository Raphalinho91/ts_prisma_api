import { FastifyReply, FastifyRequest } from "fastify";
import {
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
  EditUserLocationRequestAndReply,
  LogInRequest,
  SignUpRequest,
} from "../../interfaces/auth";
import { LogInService } from "./login";
import { SignUpService } from "./signup";
import { InfoUserService } from "./infoUser";
import logger from "../../logger";
import { BadRequestsException } from "../../utils/request/requestBad";
import { ErrorCode } from "../../utils/request/requestError";
import { EditUserLocationService } from "./editUserLocation";

export const login = async (
  request: FastifyRequest<{ Body: LogInRequest }>,
  reply: FastifyReply
) => {
  try {
    const validatedData = LogInSchema.parse(request.body);
    const userService = new UserService(request.server.prisma);
    const authService = new LogInService(userService);
    const logInReply = await authService.login(
      validatedData.email,
      validatedData.password
    );

    reply
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

    reply
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

    reply
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

    reply
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
