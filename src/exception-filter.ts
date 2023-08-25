import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
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

export type HttpError = {
  status: number,
  code: ErrorCodes,
  field?: string,
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();
    let httpError: HttpError = {
      status,
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
    };
    if (exception instanceof HttpException) {
      httpError.code = exception.message as ErrorCodes;
    }
    return res
      .status(status)
      .send({ error: httpError });
  }
}

export const HttpExceptionFilterProvider: Provider = {
  provide: APP_FILTER,
  useClass: HttpExceptionFilter,
};
