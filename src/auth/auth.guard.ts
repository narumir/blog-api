import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import {
  JwtService,
} from "@nestjs/jwt";
import {
  Request,
} from "express";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
  ) { }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers.authorization?.split(" ")[1];
    try {
      const decode = this.jwtService.verify(token);
      req["sub"] = decode.sub;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
