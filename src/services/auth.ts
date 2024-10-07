import { PrismaClient, User } from "@prisma/client";

interface IUserService {
  createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    acceptTermsOfUse: boolean
  ): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  updateUserTenant(id: string, tenantId: string): Promise<User>;
  updateUserProduct(id: string, productId: string): Promise<User>;
  updateUserRoleForSeller(id: string): Promise<User>;
}

export class UserService implements IUserService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    acceptTermsOfUse: boolean
  ): Promise<User> {
    return this.prisma.user.create({
      data: { email, password, firstName, lastName, acceptTermsOfUse },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { email } });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { id } });
  }

  async updateUserTenant(id: string, tenantId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { tenantId },
    });
  }

  async updateUserProduct(id: string, productId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { productId },
    });
  }

  async updateUserRoleForSeller(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { role: "USER_SELLER_IS_ADMIN_FOR_HIS_TENANT" },
    });
  }
}
