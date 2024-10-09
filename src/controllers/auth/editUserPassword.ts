import { BadRequestsException } from "../../utils/request/requestBad";
import { ErrorCode } from "../../utils/request/requestError";
import { UserService } from "../../services/auth";
import { EditUserPasswordRequest } from "../../interfaces/auth";
import { hash, verify } from "argon2";
import logger from "../../logger";

export class EditUserPasswordService {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async editUserPassword(request: EditUserPasswordRequest) {
    const user = await this.userService.findUserById(request.id);

    if (!user) {
      throw new BadRequestsException(
        "User does not exist!",
        ErrorCode.USER_NOT_FOUND
      );
    }

    if (!(await verify(user.password, request.currentPassword))) {
      throw new BadRequestsException(
        "Old password and current passwonrd not correspond !",
        ErrorCode.INCORRECT_PASSWORD
      );
    }

    const hashedPassword = await hash(request.newPassword);

    await this.userService.updateUserPassword(user.id, hashedPassword);

    return true;
  }
}
