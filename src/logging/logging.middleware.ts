import {
  NestMiddleware,
} from "@nestjs/common";
import type {
  NextFunction,
  Request,
  Response,
} from "express";

export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req["requestTime"] = Date.now();
    return next();
  }
}
