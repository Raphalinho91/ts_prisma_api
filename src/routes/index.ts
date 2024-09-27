import { FastifyInstance } from "fastify";
import { authRoutes } from "./authRoutes";
import { tenantRoutes } from "./tenantRoutes";
import { productRoutes } from "./productRoutes";
import { paymentRoutes } from "./paymentRoutes";

export const rootRouter = async (server: FastifyInstance) => {
  server.register(authRoutes, { prefix: "/auth" });
  server.register(tenantRoutes, { prefix: "/tenant" });
  server.register(productRoutes, { prefix: "/product" });
  server.register(paymentRoutes, { prefix: "/payment" });
};
