import fastify from "fastify";
import { PORT } from "./secrets";
import { rootRouter } from "./routes";
import logger from "./logger";
import prismaPlugin from "./database/prisma";
import fastifyCompress from "@fastify/compress";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyCaching from "@fastify/caching";

const server = fastify({ logger });

server.register(fastifyCompress);
server.register(fastifyRateLimit, {
  max: 100,
  timeWindow: "1 minute",
});
server.register(fastifyCaching);
server.register(prismaPlugin);

server.register(rootRouter, { prefix: "/api" });

server.listen({ port: Number(PORT), host: "0.0.0.0" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  logger.info(`Server listening at ${address}`);
});
