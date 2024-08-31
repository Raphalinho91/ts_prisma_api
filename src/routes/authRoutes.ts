import { FastifyInstance } from "fastify";
import { login, me, signup } from "../controllers/auth";
import { authMiddleware } from "../middleware/authorization";

export const authRoutes = async (server: FastifyInstance) => {
  server.post("/signup", signup);
  server.post("/login", login);
  server.get("/me", { preHandler: [authMiddleware] }, me);
};
