import { InfoUserReply } from "../../interfaces/auth";
import { BadRequestsException } from "../../utils/request/requestBad";
import { ErrorCode } from "../../utils/request/requestError";
import { UserService } from "../../services/auth";

export class InfoUserService {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async infoUser(id: string): Promise<InfoUserReply> {
    const user = await this.userService.findUserById(id);

    if (!user) {
      throw new BadRequestsException(
        "User does not exist!",
        ErrorCode.USER_NOT_FOUND
      );
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      country: user.country,
      region: user.region,
      postalCode: user.postalCode,
      city: user.city,
      addressOne: user.addressOne,
      addressTwo: user.addressTwo,
      acceptTermsOfUse: user.acceptTermsOfUse,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      tenantId: user.tenantId,
      productId: user.productId,
    };
  }
}
