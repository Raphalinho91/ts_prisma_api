import { ValidCode, HttpExceptionValid } from "./replySend";

export class GoodReplyException extends HttpExceptionValid {
  constructor(message: string, validCode: ValidCode, response?: any) {
    super(message, validCode, 200, response);
  }
}
