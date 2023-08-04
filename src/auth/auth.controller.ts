import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import {
  JwtService,
} from "@nestjs/jwt";
import {
  ApiBody,
} from "@nestjs/swagger";
import type {
  FastifyRequest,
  FastifyReply,
} from "fastify";
import {
  UserService,
} from "src/user/user.service";
import {
  JoinDTO,
  SignInDTO,
} from "./dto";
import {
  AuthService,
} from "./auth.service";

@Controller()
export class AuthController {
  private readonly secure = process.env.NODE_ENV === "production";
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  @ApiBody({ type: JoinDTO })
  @Post("join")
  async join(
    @Req()
    req: FastifyRequest,
    @Res({ passthrough: true })
    res: FastifyReply,
    @Body()
    body: JoinDTO,
  ) {
    const exists = await this.userService.findOneByUsername(body.username);
    if (exists != null) {
      throw new HttpException("User already exists.", HttpStatus.CONFLICT);
    }
    const newUser = await this.userService.createUser(body.username, body.password, body.nickname);
    const { refreshToken, expiredAt } = await this.authService.issueRefreshToken(newUser);
    const { accessToken } = await this.authService.issueAccessToken(newUser);
    const { agent, ip } = this.authService.getAgentAndIP(req);
    await this.authService.saveRefreshToken(newUser, refreshToken, expiredAt, agent, ip);
    res.setCookie("x-token", refreshToken, { httpOnly: true, secure: this.secure, expires: expiredAt });
    return { accessToken };
  }

  @ApiBody({ type: SignInDTO })
  @Post("signin")
  async signin(
    @Req()
    req: FastifyRequest,
    @Res({ passthrough: true })
    res: FastifyReply,
    @Body()
    body: SignInDTO,
  ) {
    const user = await this.userService.findOneByUsername(body.username);
    if (user == null) {
      throw new HttpException("fail to signin.", HttpStatus.UNAUTHORIZED);
    }
    if (!this.userService.verifyPassword(user, body.password)) {
      throw new HttpException("fail to signin.", HttpStatus.UNAUTHORIZED);
    }
    const { refreshToken, expiredAt } = await this.authService.issueRefreshToken(user);
    const { accessToken } = await this.authService.issueAccessToken(user);
    const { agent, ip } = this.authService.getAgentAndIP(req);
    await this.authService.saveRefreshToken(user, refreshToken, expiredAt, agent, ip);
    res.setCookie("x-token", refreshToken, { httpOnly: true, secure: this.secure, expires: expiredAt });
    return { accessToken };
  }

  @Post("access-token")
  async renewAccessToken(
    @Req()
    req: FastifyRequest,
  ) {
    const refreshToken = req.cookies["x-token"] as string;
    try {
      const decode = await this.jwtService.verifyAsync(refreshToken);
      const exists = await this.authService.findOneByToken(refreshToken);
      if (exists == null) {
        throw new Error("token not exists.");
      }
      const user = await this.userService.findOneByID(decode["sub"]);
      if (user == null) {
        throw new Error("user not exists.");
      }
      const { accessToken } = await this.authService.issueAccessToken(user);
      return { accessToken };
    } catch (e) {
      throw new HttpException("fail to renew access token.", HttpStatus.UNAUTHORIZED);
    }
  }

  @Post("refresh-token")
  async renewRefreshToken(
    @Req()
    req: FastifyRequest,
    @Res({ passthrough: true })
    res: FastifyReply,
  ) {
    const currentRefreshToken = req.cookies["x-token"] as string;
    try {
      const decode = await this.jwtService.verifyAsync(currentRefreshToken);
      const exists = await this.authService.findOneByToken(currentRefreshToken);
      if (exists == null) {
        throw new Error("token not exists.");
      }
      const user = await this.userService.findOneByID(decode["sub"]);
      if (user == null) {
        throw new Error("user not exists.");
      }
      const { refreshToken, expiredAt } = await this.authService.issueRefreshToken(user);
      const { agent, ip } = this.authService.getAgentAndIP(req);
      await this.authService.saveRefreshToken(user, refreshToken, expiredAt, agent, ip);
      res.setCookie("x-token", refreshToken, { httpOnly: true, secure: this.secure, expires: expiredAt });
    } catch (e) {
      throw new HttpException("fail to renew refresh token.", HttpStatus.UNAUTHORIZED);
    }
  }
}
