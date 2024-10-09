import { EditUserInfoRequestAndReply } from "../../interfaces/auth";
import { BadRequestsException } from "../../utils/request/requestBad";
import { ErrorCode } from "../../utils/request/requestError";
import { UserService } from "../../services/auth";

export class EditUserInfoService {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async editUserInfo(
    request: EditUserInfoRequestAndReply
  ): Promise<EditUserInfoRequestAndReply> {
    const user = await this.userService.findUserById(request.id);

    if (!user) {
      throw new BadRequestsException(
        "User does not exist!",
        ErrorCode.USER_NOT_FOUND
      );
    }

    const updatedUser = await this.userService.updateUserInfo(
      user.id,
      request.email,
      request.firstName,
      request.lastName
    );

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
    };
  }
}
