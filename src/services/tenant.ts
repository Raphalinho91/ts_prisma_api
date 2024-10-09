import { PrismaClient, Tenant } from "@prisma/client";

export interface ITenantService {
  createTenant(
    name: string,
    url: string,
    path: string,
    iban: string,
    firstConnection: boolean,
    userId: string
  ): Promise<Tenant>;
  findAllTenant(): Promise<
    { id: string; url: string; name: string; path: string }[]
  >;
  findTenantByUrl(url: string): Promise<Tenant | null>;
  findTenantById(id: string): Promise<Tenant | null>;
  findTenantByUserId(userId: string): Promise<Tenant | null>;
  updateProductIdInTenant(id: string, productId: string): Promise<Tenant>;
  updateFirstConnectionInTenant(
    id: string,
    firstConnection: boolean
  ): Promise<Tenant>;
}

export class TenantService implements ITenantService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createTenant(
    name: string,
    url: string,
    path: string,
    iban: string,
    firstConnection: boolean,
    userId: string
  ): Promise<Tenant> {
    return this.prisma.tenant.create({
      data: {
        name,
        url,
        path,
        iban,
        firstConnection,
        userId,
      },
    });
  }

  async findAllTenant(): Promise<
    { id: string; url: string; name: string; path: string }[]
  > {
    return this.prisma.tenant.findMany({
      select: {
        id: true,
        url: true,
        name: true,
        path: true,
      },
    });
  }

  async findTenantByUrl(url: string): Promise<Tenant | null> {
    return this.prisma.tenant.findFirst({
      where: { url },
    });
  }

  async findTenantById(id: string): Promise<Tenant | null> {
    return this.prisma.tenant.findFirst({
      where: { id },
    });
  }

  async findTenantByUserId(userId: string): Promise<Tenant | null> {
    return this.prisma.tenant.findFirst({
      where: { userId },
    });
  }

  async updateProductIdInTenant(
    id: string,
    productId: string
  ): Promise<Tenant> {
    return this.prisma.tenant.update({
      where: { id },
      data: { productId },
    });
  }

  async updateFirstConnectionInTenant(
    id: string,
    firstConnection: boolean
  ): Promise<Tenant> {
    return this.prisma.tenant.update({
      where: { id },
      data: { firstConnection },
    });
  }
}
