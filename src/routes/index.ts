import { FastifyInstance } from "fastify";
import { authRoutes } from "./authRoutes";
import { tenantRoutes } from "./tenantRoutes";
import { productRoutes } from "./productRoutes";

export const rootRouter = async (server: FastifyInstance) => {
  server.register(authRoutes, { prefix: "/auth" });
  server.register(tenantRoutes, { prefix: "/tenant" });
  server.register(productRoutes, { prefix: "/product" });
};
