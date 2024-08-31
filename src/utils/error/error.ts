import { FastifyReply } from "fastify";
import { ZodError } from "zod";
import { ErrorCode, HttpExceptionError } from "../request/requestError";

export const handleError = (error: any, reply: FastifyReply) => {
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
  } else {
    reply.status(500).send({
      message: "Internal Server Error",
      errorCode: 500,
    });
  }
};
