import { FastifyInstance } from "fastify";
import {
  authMiddleware,
  verifyIfTenantcanBeUsed,
} from "../middleware/authorization";
import { createProduct } from "../controllers/product";

export const productRoutes = async (server: FastifyInstance) => {
  server.post(
    "/add-product",
    { preHandler: [authMiddleware, verifyIfTenantcanBeUsed] },
    createProduct
  );
};
