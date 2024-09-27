import { Image, PrismaClient, Product } from "@prisma/client";

export interface IProductService {
  createProduct(
    name: string,
    type: string,
    reference: string,
    description: string | null,
    price: number,
    category: string,
    images: string[],
    userId: string,
    tenantId: string
  ): Promise<Product>;
  getProductById(id: string): Promise<Product | null>;
  getProductByTenant(tenantId: string): Promise<Product | null>;
  getImagesByProductId(productId: string): Promise<Image[] | null>;
}

export class ProductService implements IProductService {
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
  ): Promise<Product> {
    return this.prisma.$transaction(async (prisma) => {
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

  async getProductById(id: string): Promise<Product | null> {
    return this.prisma.product.findFirst({
      where: { id },
    });
  }

  async getProductByTenant(tenantId: string): Promise<Product | null> {
    return this.prisma.product.findFirst({
      where: { tenantId },
    });
  }

  async getImagesByProductId(productId: string): Promise<Image[] | null> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    return product ? product.images : null;
  }
}
