import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (server, options) => {
  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

  try {
    await prisma.$connect();
    server.decorate("prisma", prisma);
  } catch (err) {
    server.log.error("Failed to connect to Prisma");
    throw err;
  }

  server.addHook("onClose", async (server) => {
    await server.prisma.$disconnect();
  });
});

export default prismaPlugin;
