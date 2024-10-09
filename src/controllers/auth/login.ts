import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../secrets";
import { LogInReply } from "../../interfaces/auth";
import { BadRequestsException } from "../../utils/request/requestBad";
import { ErrorCode } from "../../utils/request/requestError";
import { UserService } from "../../services/auth";
import { verify } from "argon2";
import { SessionService } from "../../services/session";
import logger from "../../logger";

export class LogInService {
  private userService: UserService;
  private sessionService: SessionService;

  constructor(userService: UserService, sessionService: SessionService) {
    this.userService = userService;
    this.sessionService = sessionService;
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

    await this.sessionService.invalidateOldSession(user.id);

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "2h",
    });

    await this.sessionService.createSession(user.id, token);

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
