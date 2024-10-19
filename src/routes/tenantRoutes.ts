import { FastifyInstance } from "fastify";
import {
  authMiddleware,
  verifyIfTenantcanBeUsed,
} from "../middleware/authorization";
import {
  postShop,
  getAllShop,
  getOneShop,
  getShop,
  putShop,
  postShopPro,
} from "../controllers/shop/shop";

export const tenantRoutes = async (server: FastifyInstance) => {
  server.post("/application", { preHandler: [authMiddleware] }, postShop);
  server.get("/application-all", getAllShop);
  server.get(
    "/application-one",
    { preHandler: [verifyIfTenantcanBeUsed] },
    getOneShop
  );
  server.get("/application", { preHandler: [authMiddleware] }, getShop);
  server.put("/application", { preHandler: [authMiddleware] }, putShop);
  server.post(
    "/application-pro",
    { preHandler: [authMiddleware] },
    postShopPro
  );
};
