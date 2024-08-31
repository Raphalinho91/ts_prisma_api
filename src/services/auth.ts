import { PrismaClient } from "@prisma/client";

export class UserService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createUser(email: string, password: string, name: string) {
    return this.prisma.user.create({
      data: {
        email: email,
        password: password,
        name: name,
      },
    });
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email: email },
    });
  }

  async findUserById(id: string) {
    return this.prisma.user.findFirst({
      where: { id: id },
    });
  }
}
