import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  JwtService,
} from "@nestjs/jwt";
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
  SignInDTO,
  SignUpDTO,
  TokenDTO,
} from "./dto";
import {
  AuthService,
} from "./auth.service";
import {
  AuthGuard,
} from "./auth.guard";
import {
  Auth,
} from "./auth.decorator";
import {
  AuthToken,
} from "src/entities";

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
    const existedEmail = await this.userService.findOneByEmail(email);
    if (this.authService.checkReservedWord(email) || existedEmail != null) {
      throw new HttpException("Duplicated email", HttpStatus.BAD_REQUEST);
    }
    const existedNickname = await this.userService.findOneByNickname(nickname);
    if (this.authService.checkReservedWord(nickname) || existedNickname != null) {
      throw new HttpException("Duplicated nickname", HttpStatus.BAD_REQUEST);
    }
    const password = this.encryptService.decode(body.password);
    const user = await this.userService.createUser(email, nickname, password);
    const { token: refreshToken, expiredAt: refreshTokenExpiredAt } = await this.authService.issueRefreshToken(user);
    const { token: accessToken, expiredAt: accessTokenExpiredAt } = await this.authService.issueAccessToken(user);
    const { agent, ip } = this.authService.getAgentAndIP(req);
    await this.authService.saveRefreshToken(user, refreshToken, refreshTokenExpiredAt, agent, ip);
    return { accessToken, accessTokenExpiredAt, refreshToken, refreshTokenExpiredAt };
  }

  @Post("signin")
  public async signin(@Req() req: Request, @Body() body: SignInDTO) {
    const user = await this.userService.signWithEmail(body.email);
    if (user == null) {
      throw new HttpException("Unable to signin", HttpStatus.UNAUTHORIZED);
    }
    const password = this.encryptService.decode(body.password);
    if (await this.userService.verifyPassword(user, password) == false) {
      throw new HttpException("Unable to signin", HttpStatus.UNAUTHORIZED);
    }
    const { token: refreshToken, expiredAt: refreshTokenExpiredAt } = await this.authService.issueRefreshToken(user);
    const { token: accessToken, expiredAt: accessTokenExpiredAt } = await this.authService.issueAccessToken(user);
    const { agent, ip } = this.authService.getAgentAndIP(req);
    await this.authService.saveRefreshToken(user, refreshToken, refreshTokenExpiredAt, agent, ip);
    return { accessToken, accessTokenExpiredAt, refreshToken, refreshTokenExpiredAt };
  }

  @UseGuards(AuthGuard)
  @Post("signout")
  public async signout(@Auth() userid: string, @Body() body: TokenDTO) {
    this.authService.discardRefreshToken(userid, body.token);
  }

  @UseGuards(AuthGuard)
  @Post("access-token")
  public async renewAccessToken(@Auth() userid: string, @Body() body: TokenDTO) {
    const exists = await this.authService.findOneByToken(body.token);
    if (exists == null) {
      throw new HttpException("Token is invalid", HttpStatus.UNAUTHORIZED);
    }
    const user = await this.userService.findOneByID(userid);
    if (user == null) {
      throw new HttpException("Token is invalid", HttpStatus.UNAUTHORIZED);
    }
    const { token: accessToken, expiredAt: accessTokenExpiredAt } = await this.authService.issueAccessToken(user);
    return { accessToken, accessTokenExpiredAt };
  }

  @UseGuards(AuthToken)
  @Post("renew-token")
  public async renewRefreshToken(@Auth() userid: string, @Req() req: Request, @Body() body: TokenDTO) {
    const exists = await this.authService.findOneByToken(body.token);
    if (exists == null) {
      throw new HttpException("Token is invalid", HttpStatus.UNAUTHORIZED);
    }
    const user = await this.userService.findOneByID(userid);
    if (user == null) {
      throw new HttpException("Token is invalid", HttpStatus.UNAUTHORIZED);
    }
    const { token: refreshToken, expiredAt: refreshTokenExpiredAt } = await this.authService.issueRefreshToken(user);
    const { agent, ip } = this.authService.getAgentAndIP(req);
    await this.authService.saveRefreshToken(user, refreshToken, refreshTokenExpiredAt, agent, ip);
    await this.authService.discardRefreshToken(userid, body.token);
    return { refreshToken, refreshTokenExpiredAt };
  }
}
