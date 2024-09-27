import { FastifyInstance } from "fastify";
import { paymentIntent } from "../controllers/payment/paymentIntent";

export const paymentRoutes = async (server: FastifyInstance) => {
  server.post("/intent", paymentIntent);
};
