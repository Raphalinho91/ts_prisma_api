import { FastifyRequest, FastifyReply } from "fastify";
import { ProductService } from "../services/product";
import { TenantService } from "../services/tenant";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import logger from "../logger";

export const createProduct = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const uploadDir = path.join(__dirname, "..", "..", "uploads");
  let filePath: string = "";

  try {
    const userId = request.user?.id;
    const { tenant } = request;

    if (!request.isMultipart()) {
      return reply.status(400).send({ error: "Not a multipart request" });
    }

    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: "No data found in request" });
    }

    const fields = data.fields as Record<string, any>;

    if (!data.file || typeof data.file.pipe !== "function") {
      return reply.status(400).send({ error: "File stream is not valid" });
    }

    if (fields.tenantId.value !== tenant.id) {
      return reply.status(403).send({ error: "Tenant ID mismatch" });
    }

    const productService = new ProductService(request.server.prisma);
    const tenantService = new TenantService(request.server.prisma);

    const tenantRequest = await tenantService.findTenantById(
      fields.tenantId.value
    );

    if (!tenantRequest) {
      return reply.status(404).send({ error: "Tenant not found" });
    }

    if (tenantRequest.userId !== userId) {
      return reply
        .status(403)
        .send({ error: "User is not authorized for this tenant" });
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${uuidv4()}-${data.filename}`;
    filePath = path.join(uploadDir, fileName);

    const imagePaths = [filePath];

    logger.fatal(fields.price);

    const name = fields.name?.value ?? "";
    const type = fields.type?.value ?? "";
    const reference = fields.reference?.value ?? "";
    const description = fields.description?.value ?? "";
    const price = Number(fields.price?.value ?? 0);
    const category = fields.category?.value ?? "";
    const tenantId = fields.tenantId?.value ?? "";

    await new Promise<void>((resolve, reject) => {
      data.file
        .pipe(fs.createWriteStream(filePath))
        .on("finish", resolve)
        .on("error", reject);
    });

    const product = await productService.createProduct(
      name,
      type,
      reference,
      description,
      price,
      category,
      imagePaths,
      userId,
      tenantId
    );

    const newProduct = await productService.getProductById(product.id);

    if (!newProduct) {
      return reply.status(404).send({ error: "Failed to retrieve product" });
    }

    return reply
      .status(201)
      .send({ message: "Product created successfully", product });
  } catch (error) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlink(filePath, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting file:", unlinkError);
        }
      });
    }

    const err = error as Error;
    if (err && (err as any).code === "P2002") {
      return reply.status(409).send({
        error: "Product with this reference already exists for this tenant",
      });
    }
    console.error("Error creating product:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};
