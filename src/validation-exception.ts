import {
  HttpException,
  HttpStatus,
} from "@nestjs/common";

export class ValidationHTTPException extends HttpException {
  private field: string = "";

  constructor(message: string, feild: string) {
    super(message, HttpStatus.BAD_REQUEST);
    this.field = feild;
  }

  public getField() {
    return this.field;
  }
}
