import { FastifyInstance } from "fastify";
import { login, signup } from "../controllers/auth/auth";

export const authRoutes = async (server: FastifyInstance) => {
  server.post("/signup", signup);
  server.post("/login", login);
};
