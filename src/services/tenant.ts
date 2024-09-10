import { PrismaClient, Tenant } from "@prisma/client";

export interface ITenantService {
  createTenant(
    name: string,
    url: string,
    path: string,
    firstConnection: boolean,
    userId: string
  ): Promise<Tenant>;
  findTenantByNameOrPathOrUrl(
    name: string,
    url: string,
    path: string
  ): Promise<Tenant | null>;
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
    firstConnection: boolean,
    userId: string
  ): Promise<Tenant> {
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

  async findTenantByNameOrPathOrUrl(
    name: string,
    url: string,
    path: string
  ): Promise<Tenant | null> {
    return this.prisma.tenant.findFirst({
      where: { OR: [{ name }, { url }, { path }] },
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
