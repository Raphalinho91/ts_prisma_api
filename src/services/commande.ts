import { PrismaClient, UserCommande } from "@prisma/client";

interface ICommandeService {
  createCommande(
    userId: string,
    productId: string,
    tenantId: string,
    email: string,
    name: string,
    address: string,
    country: string,
    city: string,
    zipCode: string,
    status: string,
    totalPrice: number,
    quantity: number
  ): Promise<UserCommande>;
  findCommandeById(id: string): Promise<UserCommande | null>;
}

export class CommandeService implements ICommandeService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createCommande(
    userId: string,
    productId: string,
    tenantId: string,
    email: string,
    name: string,
    address: string,
    country: string,
    city: string,
    zipCode: string,
    status: string,
    totalPrice: number,
    quantity: number
  ): Promise<UserCommande> {
    return this.prisma.userCommande.create({
      data: {
        userId,
        productId,
        tenantId,
        email,
        name,
        address,
        country,
        city,
        zipCode,
        status,
        totalPrice,
        quantity,
      },
    });
  }

  async findCommandeById(id: string): Promise<UserCommande | null> {
    return this.prisma.userCommande.findFirst({ where: { id } });
  }
}
