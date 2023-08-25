import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Provider,
  SetMetadata,
  Type,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import {
  APP_GUARD,
  Reflector,
} from "@nestjs/core";
import {
  JwtService,
} from "@nestjs/jwt";
import type {
  FastifyRequest,
} from "fastify";
import {
  ErrorCodes,
} from "src/error-code";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targets: (Function | Type<any>)[] = [
      context.getHandler(),
      context.getClass(),
    ];
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, targets);
    if (isPublic) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new HttpException(ErrorCodes.AUTHENTICATION_FAILED, HttpStatus.UNAUTHORIZED);
    }
    try {
      const decode = await this.jwtService.verifyAsync(token);
      req["auth"] = decode["sub"];
    } catch (e) {
      throw new HttpException(ErrorCodes.AUTHENTICATION_FAILED, HttpStatus.UNAUTHORIZED);
    }
    return true;
  }

  private extractTokenFromHeader(req: FastifyRequest) {
    const [type, token] = req.headers.authorization?.split(" ") ?? [];
    return type?.toLowerCase() === "bearer" ? token : undefined;
  }
}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const AuthProvider: Provider = {
  provide: APP_GUARD,
  useClass: AuthGuard,
};
