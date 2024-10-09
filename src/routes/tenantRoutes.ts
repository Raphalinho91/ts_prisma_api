import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middleware/authorization";
import { createShop, getAllShop } from "../controllers/shop/shop";

export const tenantRoutes = async (server: FastifyInstance) => {
  server.post("/application", { preHandler: [authMiddleware] }, createShop);
  server.get("/application-url", getAllShop);
};
