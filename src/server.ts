import fastify from "fastify";
import { PORT } from "./secrets";
import { rootRouter } from "./routes";
import logger from "./logger";
import compress from "@fastify/compress";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyCaching from "@fastify/caching";
import fastifyHelmet from "@fastify/helmet";
import multipart from "@fastify/multipart";
import fastifyCors from "@fastify/cors";
import prismaPlugin from "./database/prisma";

const server = fastify({ logger });

// Plugins
server.register(compress, {
  global: true,
  encodings: ["gzip", "deflate", "br"],
  threshold: 512,
  brotliOptions: {
    params: {
      [require("zlib").constants.BROTLI_PARAM_QUALITY]: 6,
    },
  },
  zlibOptions: {
    level: 9,
  },
});

server.register(fastifyRateLimit, {
  max: 100,
  timeWindow: "1 minute",
  hook: "onRequest",
  allowList: ["127.0.0.1"],
  addHeaders: {
    "x-ratelimit-limit": true,
    "x-ratelimit-remaining": true,
    "x-ratelimit-reset": true,
  },
  keyGenerator: (request) => request.ip,
});

server.register(fastifyCaching, {
  privacy: "private",
  expiresIn: 3600 * 1000,
});

server.register(prismaPlugin);
server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
});

// Gestionnaire d'image et fichier
server.register(multipart);

// Sécurisation du serveur avec Helmet
server.register(fastifyHelmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://trusted-scripts.example.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  referrerPolicy: { policy: "no-referrer" },
  frameguard: { action: "deny" },
});

// Gestionnaire d'erreurs global
server.setErrorHandler((error, request, reply) => {
  server.log.error(error);
  reply.status(500).send({ error: "Internal Server Error" });
});

// Gestionnaire de "Route Not Found"
server.setNotFoundHandler((request, reply) => {
  reply.status(404).send({ error: "Route Not Found" });
});

// Routes
server.register(rootRouter, { prefix: "/api" });

server.listen({ port: Number(PORT), host: "0.0.0.0" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  logger.info(`Server listening at ${address}`);
});
