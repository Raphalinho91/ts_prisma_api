import { ErrorCode, HttpExceptionError } from "./requestError";

export class BadRequestsException extends HttpExceptionError {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 400, null);
  }
}
