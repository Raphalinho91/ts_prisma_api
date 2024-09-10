import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middleware/authorization";
import { createTenant } from "../controllers/tenant/createTenant";

export const tenantRoutes = async (server: FastifyInstance) => {
  server.post(
    "/application",
    { preHandler: [authMiddleware] },
    createTenant(server)
  );
};
