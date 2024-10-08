import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../secrets";
import { LogInReply } from "../../interfaces/auth";
import { BadRequestsException } from "../../utils/request/requestBad";
import { ErrorCode } from "../../utils/request/requestError";
import { UserService } from "../../services/auth";
import { verify } from "argon2";

export class LogInService {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async login(email: string, password: string): Promise<LogInReply> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new BadRequestsException(
        "User does not exist!",
        ErrorCode.USER_NOT_FOUND
      );
    }

    if (!(await verify(user.password, password))) {
      throw new BadRequestsException(
        "Incorrect password!",
        ErrorCode.INCORRECT_PASSWORD
      );
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token: token,
    };
  }
}
