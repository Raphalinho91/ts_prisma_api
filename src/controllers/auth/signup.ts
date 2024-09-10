import { hash } from "bcryptjs";
import { SignUpRequest, SignUpReply } from "../../interfaces/auth";
import { BadRequestsException } from "../../utils/request/requestBad";
import { ErrorCode } from "../../utils/request/requestError";
import { UserService } from "../../services/auth";

export class SignUpService {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async signUp(request: SignUpRequest): Promise<SignUpReply> {
    const user = await this.userService.findUserByEmail(request.email);

    if (user) {
      throw new BadRequestsException(
        "User already exists!",
        ErrorCode.USER_ALREADY_EXISTS
      );
    }

    const hashedPassword = await hash(request.password, 12);
    const newUser = await this.userService.createUser(
      request.email,
      hashedPassword,
      request.name
    );

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
  }
}
