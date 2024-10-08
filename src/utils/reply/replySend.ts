export class HttpExceptionValid {
  message: string;
  validCode: ValidCode;
  statusCode: number;
  response: any;

  constructor(
    message: string,
    validCode: ValidCode,
    statusCode: number,
    response: any
  ) {
    this.message = message;
    this.validCode = validCode;
    this.statusCode = statusCode;
    this.response = response;
  }
}

export enum ValidCode {
  USER_SIGN_UP = 2001,
  USER_LOG_IN = 2002,
  PRODUCT_CREATED = 2003,
  TENANT_CREATED = 2004,
  USER_FETCHED = 2005,
  USER_EDIT = 2006,
}
