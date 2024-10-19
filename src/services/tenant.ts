import { PrismaClient, Tenant } from "@prisma/client";

export interface ITenantService {
  createTenant(
    name: string,
    path: string,
    url: string,
    iban: string,
    firstConnection: boolean,
    userId: string
  ): Promise<Tenant>;
  findAllTenant(): Promise<
    { id: string; url: string; name: string; path: string }[]
  >;
  findTenantByUrl(url: string): Promise<Tenant | null>;
  findTenantByPathOrNameOrUrl(
    path: string,
    name: string,
    url: string
  ): Promise<Tenant | null>;
  findTenantById(id: string): Promise<Tenant | null>;
  findTenantByUserId(userId: string): Promise<Tenant | null>;
  updateProductIdInTenant(id: string, productId: string): Promise<Tenant>;
  updateFirstConnectionInTenant(
    id: string,
    firstConnection: boolean
  ): Promise<Tenant>;
  updateTenant(
    id: string,
    name: string,
    path: string,
    url: string,
    iban?: string | null
  ): Promise<Tenant>;
  updateInfoProTenant(
    id: string,
    email?: string | null,
    phoneNumber?: string | null
  ): Promise<Tenant>;
}

export class TenantService implements ITenantService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createTenant(
    name: string,
    path: string,
    url: string,
    iban: string,
    firstConnection: boolean,
    userId: string
  ): Promise<Tenant> {
    return this.prisma.tenant.create({
      data: {
        name,
        path,
        url,
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

  async findTenantByPathOrNameOrUrl(
    path: string,
    name: string,
    url: string
  ): Promise<Tenant | null> {
    return this.prisma.tenant.findFirst({
      where: {
        OR: [{ path }, { name }, { url }],
      },
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

  async updateTenant(
    id: string,
    name: string,
    path: string,
    url: string,
    iban?: string | null
  ): Promise<Tenant> {
    const data: { name: string; path: string; url: string; iban?: string } = {
      name,
      path,
      url,
    };
    if (iban !== null) {
      data.iban = iban;
    }
    return this.prisma.tenant.update({
      where: { id },
      data,
    });
  }

  async updateInfoProTenant(
    id: string,
    email?: string | null,
    phoneNumber?: string | null
  ): Promise<Tenant> {
    return this.prisma.tenant.update({
      where: { id },
      data: { email, phoneNumber },
    });
  }
}
