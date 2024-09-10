import { FastifyReply } from "fastify";
import { ZodError } from "zod";
import { ErrorCode, HttpExceptionError } from "../request/requestError";
import fs from "fs";
import logger from "../../logger";

export const handleError = async (
  error: any,
  reply: FastifyReply,
  filePath?: string | null
) => {
  if (error instanceof ZodError) {
    reply.status(422).send({
      message: "Validation error",
      errorCode: ErrorCode.VALIDATION_ERROR,
      errors: error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  } else if (error instanceof HttpExceptionError) {
    reply.status(error.statusCode).send({
      message: error.message,
      errorCode: error.errorCode,
      errors: error.errors,
    });
  } else if (error && (error as any).code === "P2002") {
    const target = (error as any).meta?.target;
    reply.status(409).send({
      message: `Resource conflict: ${
        target
          ? `Field ${target} already exists`
          : "Unique constraint violation"
      }`,
      errorCode: ErrorCode.CONFLICT_ERROR,
    });
  } else {
    logger.error("Unhandled error:", error);
    reply.status(500).send({
      message: "Internal Server Error",
      errorCode: ErrorCode.INTERNAL_ERROR,
    });
  }

  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (unlinkError) => {
      if (unlinkError) {
        logger.error("Error deleting file:", unlinkError);
      } else {
        logger.info(`File ${filePath} deleted successfully.`);
      }
    });
  }
};
