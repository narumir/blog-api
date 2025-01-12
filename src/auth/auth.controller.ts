import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from "@nestjs/common";
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  ConfigService,
} from "@nestjs/config";
import {
  Response,
} from "express";
import {
  AuthService,
} from "./auth.service";
import {
  MemberService,
} from "src/member/member.service";
import {
  LoginDTO,
  RegisterDTO,
  TokenRes,
} from "./dto";
import {
  UserAuth,
} from "./auth.guard";

@ApiTags("Auth")
@Controller()
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly memberService: MemberService,
    private readonly configService: ConfigService,
  ) { }

  @ApiOperation({ summary: "login", description: "login with username and password" })
  @ApiConsumes("application/json")
  @ApiProduces("application/json")
  @ApiBody({ type: LoginDTO })
  @ApiOkResponse({ type: TokenRes, description: "login has been successful" })
  @HttpCode(HttpStatus.OK)
  @Post("login")
  public async login(
    @Res() res: Response,
    @Body() body: LoginDTO,
  ) {
    const member = await this.authService.validateUser(body.username, body.password);
    const accessToken = this.authService.generateAccessToken(member);
    const accessTokenExpires = this.authService.getExpireDate(accessToken);
    const refreshToken = this.authService.generateRefreshToken(member);
    const refreshTokenExpires = this.authService.getExpireDate(refreshToken);
    return res
      .cookie("refresh-token", refreshToken, {
        httpOnly: true,
        secure: this.configService.getOrThrow<boolean>("isProduction"),
        sameSite: "none",
        expires: refreshTokenExpires
      })
      .json({
        accessToken,
        accessTokenExpires,
      });
  }

  @ApiOperation({ summary: "register", description: "sign up for membership" })
  @ApiConsumes("application/json")
  @ApiProduces("application/json")
  @ApiBody({ type: RegisterDTO })
  @ApiOkResponse({ type: TokenRes, description: "registration has been successful" })
  @HttpCode(HttpStatus.OK)
  @Post("register")
  public async register(
    @Res() res: Response,
    @Body() body: RegisterDTO,
  ) {
    const hash = await this.authService.hashPassword(body.password);
    const member = await this.memberService.register(body.username, hash, body.nickname);
    const accessToken = this.authService.generateAccessToken(member);
    const accessTokenExpires = this.authService.getExpireDate(accessToken);
    const refreshToken = this.authService.generateRefreshToken(member);
    const refreshTokenExpires = this.authService.getExpireDate(refreshToken);
    return res
      .cookie("refresh-token", refreshToken, {
        httpOnly: true,
        secure: this.configService.getOrThrow<boolean>("isProduction"),
        sameSite: "none",
        expires: refreshTokenExpires
      })
      .json({
        accessToken,
        accessTokenExpires,
      });
  }

  @ApiOperation({ summary: "withdraw", description: "withdraw for membership" })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "withdraw has been successful." })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("withdraw")
  public async withdraw(
    @UserAuth() memberId: number,
  ) {
    await this.memberService.withdraw(memberId);
    return;
  }
}
