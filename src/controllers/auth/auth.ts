import { FastifyReply, FastifyRequest } from "fastify";
import { LogInSchema, SignUpSchema } from "../../schemas/auth";
import { handleError } from "../../utils/error/error";
import { GoodReplyException } from "../../utils/reply/replyGood";
import { ValidCode } from "../../utils/reply/replySend";
import { UserService } from "../../services/auth";
import { LogInRequest, SignUpRequest } from "../../interfaces/auth";
import { LogInService } from "./login";
import { SignUpService } from "./signup";

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
