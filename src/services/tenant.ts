import { PrismaClient } from "@prisma/client";

export class TenantService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createTenant(
    name: string,
    url: string,
    path: string,
    firstConnection: boolean,
    userId: string
  ) {
    return this.prisma.tenant.create({
      data: {
        name,
        url,
        path,
        firstConnection,
        userId,
      },
    });
  }

  async findTenantByNameOrPathOrUrl(name: string, url: string, path: string) {
    return this.prisma.tenant.findFirst({
      where: { OR: [{ name }, { url }, { path }] },
    });
  }

  async findTenantByUrl(url: string) {
    return this.prisma.tenant.findFirst({
      where: { url: url },
    });
  }
  async findTenantById(id: string) {
    return this.prisma.tenant.findFirst({
      where: { id: id },
    });
  }
}
