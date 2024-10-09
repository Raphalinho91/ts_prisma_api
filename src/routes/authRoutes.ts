import { FastifyInstance } from "fastify";
import {
  editUserInfo,
  editUserLocation,
  editUserPassword,
  infoUser,
  login,
  signup,
} from "../controllers/auth/auth";
import { authMiddleware } from "../middleware/authorization";

export const authRoutes = async (server: FastifyInstance) => {
  server.post("/signup", signup);
  server.post("/login", login);
  server.get("/info-user", { preHandler: [authMiddleware] }, infoUser);
  server.put(
    "/location-user",
    { preHandler: [authMiddleware] },
    editUserLocation
  );
  server.put("/info-user", { preHandler: [authMiddleware] }, editUserInfo);
  server.put(
    "/password-user",
    { preHandler: [authMiddleware] },
    editUserPassword
  );
};
