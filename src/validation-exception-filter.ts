import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Provider,
} from "@nestjs/common";
import {
  APP_FILTER,
} from "@nestjs/core";
import {
  FastifyReply,
} from "fastify";
import {
  ErrorCodes,
} from "./error-code";
import {
  ValidationHTTPException,
} from "./validation-exception";
import {
  HttpError,
} from "./exception-filter";

@Catch(ValidationHTTPException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationHTTPException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();
    let httpError: HttpError = {
      status,
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
    };
    if (exception instanceof ValidationHTTPException) {
      httpError.field = exception.getField();
      httpError.code = exception.message as ErrorCodes;
    }
    return res
      .status(status)
      .send({ error: httpError });
  }
}

export const ValidationExceptionFilterProvider: Provider = {
  provide: APP_FILTER,
  useClass: ValidationExceptionFilter,
};
