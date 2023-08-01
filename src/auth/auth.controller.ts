import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import type {
  Request,
  Response,
} from "express";
import {
  JoinDTO,
  SignInDTO,
} from "./dto";
import {
  AuthService,
} from "./auth.service";
import {
  UserService,
} from "src/user/user.service";

@Controller()
export class AuthController {
  private readonly secure = process.env.NODE_ENV === "production";
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  @Post("join")
  async join(
    @Req()
    req: Request,
    @Res({ passthrough: true })
    res: Response,
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
    res.cookie("x-token", refreshToken, { httpOnly: true, secure: this.secure, expires: expiredAt });
    return { accessToken };
  }

  @Post("signin")
  async signin(
    @Req()
    req: Request,
    @Res({ passthrough: true })
    res: Response,
    @Body()
    body: SignInDTO,
  ) {
    const user = await this.userService.findOneByUsername(body.username);
    if (user == null) {
      throw new HttpException("fail to signin.", HttpStatus.UNAUTHORIZED);
    }
    if (!this.authService.verifyPassword(user, body.password)) {
      throw new HttpException("fail to signin.", HttpStatus.UNAUTHORIZED);
    }
    const { refreshToken, expiredAt } = await this.authService.issueRefreshToken(user);
    const { accessToken } = await this.authService.issueAccessToken(user);
    const { agent, ip } = this.authService.getAgentAndIP(req);
    await this.authService.saveRefreshToken(user, refreshToken, expiredAt, agent, ip);
    res.cookie("x-token", refreshToken, { httpOnly: true, secure: this.secure, expires: expiredAt });
    return { accessToken };
  }
}
