import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from "@nestjs/common";
import type {
  Request,
  Response,
} from "express";
import {
  LoggingService,
} from "./logging.service";

@Catch(HttpException)
export class LoggingFilter implements ExceptionFilter {

  private readonly logger = new Logger(LoggingFilter.name);

  constructor(
    private readonly loggingService: LoggingService,
  ) { }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const { method, path } = req;
    const userAgent = req.headers["user-agent"] || "";
    const statusCode = exception.getStatus();
    const ip = this.loggingService.getIP(req);
    const latency = Date.now() - req["requestTime"];
    const log = {
      method,
      path,
      statusCode,
      latency,
      ip,
      userAgent,
    };
    this.logger.log(log);
    const contentType = req.headers["content-type"] || "";
    const searchParam = req.query;
    const body = this.loggingService.maskingBody(req.body);
    const err = {
      method,
      path,
      statusCode,
      latency,
      ip,
      userAgent,
      contentType,
      searchParam,
      body,
    };
    this.logger.error(err);
    return res
      .status(statusCode)
      .json(exception.getResponse());
  }
}
