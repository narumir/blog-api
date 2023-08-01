import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import {
  JwtService,
} from "@nestjs/jwt";
import type {
  NextFunction,
  Request,
  Response,
} from "express";

@Injectable()
export class JWTMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    if ("authorization" in req.headers === false) {
      return next();
    }
    const [authType, accessToken] = req.headers["authorization"].split(" ");
    if (authType.toLowerCase() !== "bearer") {
      throw new BadRequestException("Unsupport authorization type.");
    }
    let decode: Object;
    try {
      decode = await this.jwtService.verifyAsync(accessToken);
    } catch (e) {
      throw new UnauthorizedException();
    }
    if (typeof decode !== "object" || !decode.hasOwnProperty("sub")) {
      throw new UnauthorizedException();
    }
    req["auth"] = decode["sub"];
    return next();
  }
}
