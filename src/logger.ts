import pino from "pino";
import PinoPretty from "pino-pretty";

const logger = pino(
  PinoPretty({
    colorize: true,
    levelFirst: true,
    translateTime: true,
  })
);

export default logger;
