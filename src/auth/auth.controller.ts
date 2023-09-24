import {
  Body,
  Controller,
  Post,
  Req,
} from "@nestjs/common";
import {
  Request,
} from "express";
import {
  EncryptService,
} from "src/encrypt/encrypt.service";
import {
  UserService,
} from "src/user/user.service";
import {
  SignUpDTO,
} from "./dto";
import {
  AuthService,
} from "./auth.service";

@Controller()
export class AuthController {
  constructor(
    private readonly encryptService: EncryptService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  @Post("signup")
  public async signUp(@Req() req: Request, @Body() body: SignUpDTO) {
    const { email, nickname } = body;
    const password = this.encryptService.decode(body.password);
    const user = await this.userService.createUser(email, nickname, password);
    const { token: refreshToken, expiredAt: refreshTokenExpiredAt } = await this.authService.issueRefreshToken(user);
    const { token: accessToken, expiredAt: accessTokenExpiredAt } = await this.authService.issueAccessToken(user);
    const { agent, ip } = this.authService.getAgentAndIP(req);
    await this.authService.saveRefreshToken(user, refreshToken, refreshTokenExpiredAt, agent, ip);
    return { accessToken, accessTokenExpiredAt, refreshToken, refreshTokenExpiredAt };
  }
}
