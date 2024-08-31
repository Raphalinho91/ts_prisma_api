export class HttpExceptionError extends Error {
  message: string;
  errorCode: ErrorCode;
  statusCode: number;
  errors: any;

  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    errors: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  VALIDATION_ERROR = 1004,
  UNAUTHORIZED = 1005,
  INVALID_TOKEN = 1006,
  TENANT_NOT_FOUND = 1007,
  TENANT_ALREADY_EXISTS = 1008,
  TENANT_CANNOT_BE_USED = 1009,
  BODY_IS_REQUIRED = 1010,
}
