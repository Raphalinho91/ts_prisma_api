import { FastifyReply, FastifyRequest } from "fastify";
import { compare, hash } from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { LogInSchema, SignUpSchema } from "../schemas/auth";
import { UserService } from "../services/auth";
import {
  LogInReply,
  LogInRequest,
  SignUpReply,
  SignUpRequest,
} from "../interfaces/auth";
import { BadRequestsException } from "../utils/request/requestBad";
import { ErrorCode } from "../utils/request/requestError";
import { GoodReplyException } from "../utils/reply/replyGood";
import { ValidCode } from "../utils/reply/replySend";
import { handleError } from "../utils/error/error";

export const signup = async (
  request: FastifyRequest<{ Body: SignUpRequest }>,
  reply: FastifyReply
) => {
  try {
    const validatedData = SignUpSchema.parse(request.body);
    const userService = new UserService(request.server.prisma);
    const user = await userService.findUserByEmail(validatedData.email);

    if (user) {
      throw new BadRequestsException(
        "User already exists!",
        ErrorCode.USER_ALREADY_EXISTS
      );
    }

    const hashedPassword = await hash(validatedData.password, 12);

    const newUser = await userService.createUser(
      validatedData.email,
      hashedPassword,
      validatedData.name
    );

    const signUpReply: SignUpReply = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

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

export const login = async (
  request: FastifyRequest<{ Body: LogInRequest }>,
  reply: FastifyReply
) => {
  try {
    const validatedData = LogInSchema.parse(request.body);
    const userService = new UserService(request.server.prisma);
    const user = await userService.findUserByEmail(validatedData.email);

    if (!user) {
      throw new BadRequestsException(
        "User does not exists !",
        ErrorCode.USER_NOT_FOUND
      );
    }

    if (!(await compare(validatedData.password, user.password))) {
      throw new BadRequestsException(
        "Incorrect password !",
        ErrorCode.INCORRECT_PASSWORD
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
      { algorithm: "HS256", expiresIn: "1h" }
    );

    const logInReply: LogInReply = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token: token,
    };

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

export const me = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!request.user) {
    return reply.code(401).send({ error: "User not authenticated" });
  }
  reply.code(200).send(request.user);
};
