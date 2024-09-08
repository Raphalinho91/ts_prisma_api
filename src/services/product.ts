import { PrismaClient } from "@prisma/client";

export class ProductService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createProduct(
    name: string,
    type: string,
    reference: string,
    description: string | null,
    price: number,
    category: string,
    images: string[],
    userId: string,
    tenantId: string
  ) {
    return await this.prisma.$transaction(async (prisma) => {
      const product = await prisma.product.create({
        data: {
          name,
          type,
          reference,
          description,
          price,
          category,
          userId,
          tenantId,
        },
      });

      await prisma.image.createMany({
        data: images.map((url) => ({
          url,
          productId: product.id,
        })),
      });

      return product;
    });
  }
  async getProductById(id: string) {
    return this.prisma.product.findFirst({
      where: { id: id },
    });
  }
}
