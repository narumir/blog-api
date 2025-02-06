import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import {
  Observable,
  tap,
} from "rxjs";
import type {
  Request,
  Response,
} from "express";
import {
  LoggingService,
} from "./logging.service";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

  private readonly logger = new Logger(LoggingInterceptor.name);

  constructor(
    private readonly loggingService: LoggingService,
  ) { }

  private accessLog(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<Request>();
    const now = req["requestTime"] || Date.now();
    const { path, method } = req;
    const ip = this.loggingService.getIP(req);
    const userAgent = req.headers["user-agent"] || "";
    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse<Response>();
        const { statusCode } = res;
        const latency = Date.now() - now;
        const log = {
          method,
          path,
          statusCode,
          latency,
          ip,
          userAgent,
        };
        this.logger.log(log);
      })
    );
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    if (context.getType() === "http") {
      return this.accessLog(context, next);
    }
  }
}
