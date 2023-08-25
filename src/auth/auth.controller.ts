import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
import {
  JwtService,
} from "@nestjs/jwt";
import {
  ApiBody,
} from "@nestjs/swagger";
import type {
  FastifyRequest,
} from "fastify";
import {
  UserService,
} from "src/user/user.service";
import {
  EncryptService,
} from "src/encrypt/encrypt.service";
import {
  JoinDTO,
  SignInDTO,
  TokenDTO,
} from "./dto";
import {
  AuthService,
} from "./auth.service";
import {
  Public,
} from "./auth.guard";
import {
  ErrorCodes,
} from "src/error-code";

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly encryptService: EncryptService,
  ) { }

  @ApiBody({ type: JoinDTO })
  @Public()
  @Post("join")
  async join(
    @Req()
    req: FastifyRequest,
    @Body()
    body: JoinDTO,
  ) {
    const exists = await this.userService.findOneByUsername(body.username);
    if (exists != null) {
      throw new HttpException(ErrorCodes.ALREADY_EXIST, HttpStatus.CONFLICT);
    }
    const password = this.encryptService.decode(body.password);
    const newUser = await this.userService.createUser(body.username, password, body.nickname);
    const { refreshToken, expiredAt: refreshTokenExpiredAt } = await this.authService.issueRefreshToken(newUser);
    const { accessToken, expiredAt: accessTokenExpiredAt } = await this.authService.issueAccessToken(newUser);
    const { agent, ip } = this.authService.getAgentAndIP(req);
    await this.authService.saveRefreshToken(newUser, refreshToken, refreshTokenExpiredAt, agent, ip);
    return { accessToken, accessTokenExpiredAt, refreshToken, refreshTokenExpiredAt };
  }

  @ApiBody({ type: SignInDTO })
  @Public()
  @Post("signin")
  async signin(
    @Req()
    req: FastifyRequest,
    @Body()
    body: SignInDTO,
  ) {
    const user = await this.userService.findOneByUsername(body.username);
    if (user == null) {
      throw new HttpException(ErrorCodes.AUTHENTICATION_FAILED, HttpStatus.UNAUTHORIZED);
    }
    const password = this.encryptService.decode(body.password);
    if (await this.userService.verifyPassword(user, password) == false) {
      throw new HttpException(ErrorCodes.AUTHENTICATION_FAILED, HttpStatus.UNAUTHORIZED);
    }
    const { refreshToken, expiredAt: refreshTokenExpiredAt } = await this.authService.issueRefreshToken(user);
    const { accessToken, expiredAt: accessTokenExpiredAt } = await this.authService.issueAccessToken(user);
    const { agent, ip } = this.authService.getAgentAndIP(req);
    await this.authService.saveRefreshToken(user, refreshToken, refreshTokenExpiredAt, agent, ip);
    return { accessToken, accessTokenExpiredAt, refreshToken, refreshTokenExpiredAt };
  }

  @ApiBody({ type: TokenDTO })
  @Post("signout")
  async signout(
    @Body()
    body: TokenDTO,
  ) {
    await this.authService.discardRefreshToken(body.token);
    return { success: true };
  }

  @ApiBody({ type: TokenDTO })
  @Public()
  @Post("access-token")
  async renewAccessToken(
    @Body()
    body: TokenDTO,
  ) {
    const decode = await this.jwtService.verifyAsync(body.token);
    const exists = await this.authService.findOneByToken(body.token);
    if (exists == null) {
      throw new HttpException(ErrorCodes.NOT_EXIST, HttpStatus.UNAUTHORIZED);
    }
    const user = await this.userService.findOneByID(decode["sub"]);
    if (user == null) {
      throw new HttpException(ErrorCodes.NOT_EXIST, HttpStatus.UNAUTHORIZED);
    }
    const { accessToken, expiredAt: accessTokenExpiredAt } = await this.authService.issueAccessToken(user);
    return { accessToken, accessTokenExpiredAt };
  }

  @ApiBody({ type: TokenDTO })
  @Public()
  @Post("refresh-token")
  async renewRefreshToken(
    @Req()
    req: FastifyRequest,
    @Body()
    body: TokenDTO,
  ) {
    const decode = await this.jwtService.verifyAsync(body.token);
    const exists = await this.authService.findOneByToken(body.token);
    if (exists == null) {
      throw new HttpException(ErrorCodes.NOT_EXIST, HttpStatus.UNAUTHORIZED);
    }
    const user = await this.userService.findOneByID(decode["sub"]);
    if (user == null) {
      throw new HttpException(ErrorCodes.NOT_EXIST, HttpStatus.UNAUTHORIZED);
    }
    const { refreshToken, expiredAt: refreshTokenExpiredAt } = await this.authService.issueRefreshToken(user);
    const { agent, ip } = this.authService.getAgentAndIP(req);
    await this.authService.saveRefreshToken(user, refreshToken, refreshTokenExpiredAt, agent, ip);
    await this.authService.discardRefreshToken(body.token);
    return { refreshToken, refreshTokenExpiredAt };
  }
}
