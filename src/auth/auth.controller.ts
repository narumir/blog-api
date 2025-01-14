import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
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
  Request,
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
  TokenDTO,
  UpdatePasswordDTO,
} from "./dto";
import {
  AuthGuard,
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
  @ApiOkResponse({ type: TokenDTO, description: "login has been successful" })
  @Post("login")
  @HttpCode(HttpStatus.OK)
  public async login(
    @Res() res: Response,
    @Body() body: LoginDTO,
  ) {
    const member = await this.authService.validateUser(body.username, body.password);
    if (member == null) {
      throw new UnauthorizedException("invalid credentials");
    }
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
      .json(TokenDTO.fromData(accessToken, accessTokenExpires));
  }

  @ApiOperation({ summary: "logout", description: "logout" })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "logout has been successful" })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  public logout(
    @Res() res: Response,
  ) {
    return res
      .clearCookie("refresh-token")
      .end();
  }

  @ApiOperation({ summary: "register", description: "sign up for membership" })
  @ApiConsumes("application/json")
  @ApiProduces("application/json")
  @ApiBody({ type: RegisterDTO })
  @ApiOkResponse({ type: TokenDTO, description: "registration has been successful" })
  @Post("register")
  @HttpCode(HttpStatus.OK)
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
      .json(TokenDTO.fromData(accessToken, accessTokenExpires));
  }

  @ApiOperation({ summary: "withdraw", description: "withdraw for membership" })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "withdraw has been successful." })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete("withdraw")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async withdraw(
    @UserAuth() memberId: number,
  ) {
    await this.memberService.withdraw(memberId);
    return;
  }

  @ApiOperation({ summary: "issue access token", description: "issue new access token" })
  @ApiProduces("application/json")
  @ApiOkResponse({ type: TokenDTO, description: "reissue has been successful" })
  @ApiCookieAuth()
  @Post("access-token")
  @HttpCode(HttpStatus.OK)
  public async reissue(
    @Req() req: Request,
  ) {
    const refreshToken: string = req.cookies["refresh-token"];
    try {
      const verify = this.authService.verifyRefreshToken(refreshToken);
      const memberId = parseInt(verify["sub"] as string, 10);
      const member = await this.memberService.getMemberById(memberId);
      const accessToken = this.authService.generateAccessToken(member);
      const accessTokenExpires = this.authService.getExpireDate(accessToken);
      return TokenDTO.fromData(accessToken, accessTokenExpires);
    } catch (e) {
      throw new UnauthorizedException("Invalid token");
    }
  }

  @ApiOperation({ summary: "update password", description: "update password" })
  @ApiConsumes("application/json")
  @ApiProduces("application/json")
  @ApiBearerAuth()
  @ApiBody({ type: UpdatePasswordDTO })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @UseGuards(AuthGuard)
  @Patch("change-password")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async changePassword(
    @UserAuth() memberId: number,
    @Body() body: UpdatePasswordDTO,
  ) {
    const verify = await this.authService.validateCredentials(memberId, body.currentPassword);
    if (!verify) {
      throw new UnauthorizedException("invalid credentials");
    }
    const hashPassword = await this.authService.hashPassword(body.newPassword);
    const result = await this.authService.updatePassword(memberId, hashPassword);
    if (result) {
      return;
    }
    // wtf?
    return;
  }
}
