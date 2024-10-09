import { EditUserLocationRequestAndReply } from "../../interfaces/auth";
import { BadRequestsException } from "../../utils/request/requestBad";
import { ErrorCode } from "../../utils/request/requestError";
import { UserService } from "../../services/auth";

export class EditUserLocationService {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async editUserLocation(
    request: EditUserLocationRequestAndReply
  ): Promise<EditUserLocationRequestAndReply> {
    const user = await this.userService.findUserById(request.id);

    if (!user) {
      throw new BadRequestsException(
        "User does not exist!",
        ErrorCode.USER_NOT_FOUND
      );
    }

    const updatedUser = await this.userService.updateUserLocation(
      user.id,
      request.country,
      request.region,
      request.postalCode,
      request.city,
      request.addressOne,
      request.addressTwo
    );

    return {
      id: updatedUser.id,
      country: updatedUser.country,
      region: updatedUser.region,
      postalCode: updatedUser.postalCode,
      city: updatedUser.city,
      addressOne: updatedUser.addressOne,
      addressTwo: updatedUser.addressTwo,
    };
  }
}
