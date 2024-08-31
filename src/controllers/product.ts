import { FastifyRequest, FastifyReply } from "fastify";
import { ProductService } from "../services/product";
import { CreateProductRequest } from "../interfaces/product";
import { TenantService } from "../services/tenant";

export const createProduct = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = request.user?.id;
    const tenantId = request.tenant?.id;
    const { name, type, reference, description, price, category, images } =
      request.body as CreateProductRequest;

    const productService = new ProductService(request.server.prisma);
    const tenantService = new TenantService(request.server.prisma);

    const tenant = await tenantService.findTenantById(tenantId);
    if (!tenant) {
      return reply.status(404).send({ error: "Tenant not found" });
    }

    if (tenant.userId !== userId) {
      return reply
        .status(403)
        .send({ error: "User is not authorized for this tenant" });
    }

    const existingProduct =
      await productService.findProductByTenantAndReference(tenantId, reference);
    if (existingProduct) {
      return reply.status(409).send({
        error: "Product with this reference already exists for this tenant",
      });
    }

    const product = await productService.createProduct(
      name,
      type,
      reference,
      description,
      price,
      category,
      images,
      userId,
      tenantId
    );

    return reply
      .status(201)
      .send({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};
