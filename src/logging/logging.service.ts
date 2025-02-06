import {
  Injectable,
} from "@nestjs/common";
import type {
  Request,
} from "express";

@Injectable()
export class LoggingService {
  public getIP(req: Request) {
    const forwarded = (req.headers["x-forwarded-for"] as string)?.split(",");
    let ip = Array.isArray(forwarded)
      ? forwarded[0].trim()
      : req.ip;
    if (ip.startsWith("::ffff:")) {
      ip = ip.replace("::ffff:", "");
    }
    return ip;
  }

  public maskingBody<T extends Record<string, any>>(body: T) {
    if (body == null) {
      return;
    }
    if ("password" in body) {
      body = {
        ...body,
        password: "*****",
      };
    }
    return body;
  }
}
