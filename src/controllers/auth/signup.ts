import { hash } from "bcryptjs";
import { SignUpRequest, SignUpReply } from "../../interfaces/auth";
import { BadRequestsException } from "../../utils/request/requestBad";
import { ErrorCode } from "../../utils/request/requestError";
import { UserService } from "../../services/auth";
import logger from "../../logger";

export class SignUpService {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async signUp(request: SignUpRequest): Promise<SignUpReply> {
    logger.fatal({ request });
    const user = await this.userService.findUserByEmail(request.email);

    if (user) {
      throw new BadRequestsException(
        "User already exists!",
        ErrorCode.USER_ALREADY_EXISTS
      );
    }
    if (!request.acceptTermsOfUse) {
      throw new BadRequestsException(
        "User not accept terms of use!",
        ErrorCode.USER_NOT_ACCEPTS_TERMS_OF_USE
      );
    }

    const hashedPassword = await hash(request.password, 12);
    const newUser = await this.userService.createUser(
      request.email,
      hashedPassword,
      request.firstName,
      request.lastName,
      request.acceptTermsOfUse
    );

    return {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      acceptTermsOfUse: newUser.acceptTermsOfUse,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
  }
}
