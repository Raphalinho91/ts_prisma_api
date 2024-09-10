import { FastifyInstance } from "fastify";
import {
  authMiddleware,
  verifyIfTenantcanBeUsed,
} from "../middleware/authorization";
import { ProductService } from "../services/product";
import { TenantService } from "../services/tenant";
import { UserService } from "../services/auth";
import { FileService } from "../controllers/product/createProduct/fileService";
import { ValidationService } from "../controllers/product/createProduct/validationService";
import { ProductController } from "../controllers/product/createProduct/productController";

export const productRoutes = async (server: FastifyInstance) => {
  const productService = new ProductService(server.prisma);
  const tenantService = new TenantService(server.prisma);
  const userService = new UserService(server.prisma);
  const fileService = new FileService();
  const validationService = new ValidationService();

  const productController = new ProductController(
    productService,
    tenantService,
    userService,
    fileService,
    validationService
  );

  server.post(
    "/add-product",
    { preHandler: [authMiddleware, verifyIfTenantcanBeUsed] },
    productController.createProduct.bind(productController)
  );
};
