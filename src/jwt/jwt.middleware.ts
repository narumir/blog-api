import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import {
  JwtService,
} from "@nestjs/jwt";
import {
  NextFunction,
  Request,
  Response,
} from "express";

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers["authorization"];
    if (authorization == null) {
      return next();
    }
    const [type, token] = authorization.split(" ");
    if (token == null) {
      return next();
    }
    if (type !== "bearer") {
      throw new HttpException("Unsupport token type", HttpStatus.BAD_REQUEST);
    }
    try {
      const decode = await this.jwtService.verifyAsync(token);
      req["sub"] = decode.sub;
      next();
    } catch (e) {
      throw new HttpException("Token is invalid", HttpStatus.UNAUTHORIZED);
    }
  }
}
