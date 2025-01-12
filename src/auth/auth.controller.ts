import {
  Body,
  Controller,
  Post,
} from "@nestjs/common";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from "@nestjs/swagger";
import {
  AuthService,
} from "./auth.service";
import {
  MemberService,
} from "src/member/member.service";
import {
  LoginDTO,
  RegisterDTO,
} from "./dto";

@ApiTags("Auth")
@Controller()
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly memberService: MemberService,
  ) { }

  @ApiOperation({ summary: "login", description: "Login with username and password" })
  @ApiConsumes("application/json")
  @ApiProduces("application/json")
  @ApiBody({ type: LoginDTO })
  @Post("login")
  public async login(@Body() body: LoginDTO) {
    const member = await this.authService.validateUser(body.username, body.password);
    const accessToken = this.authService.generateAccessToken(member);
    const accessTokenExpires = this.authService.getExpireDate(accessToken);
    const refreshToken = this.authService.generateRefreshToken(member);
    const refreshTokenExpires = this.authService.getExpireDate(refreshToken);
    return {
      accessToken,
      accessTokenExpires,
      refreshToken,
      refreshTokenExpires,
    };
  }

  @ApiOperation({ summary: "register", description: "Sign up for membership" })
  @ApiConsumes("application/json")
  @ApiProduces("application/json")
  @ApiBody({ type: RegisterDTO })
  @Post("register")
  public async register(@Body() body: RegisterDTO) {
    const member = await this.memberService.register(body.username, body.password, body.nickname);
    const accessToken = this.authService.generateAccessToken(member);
    const accessTokenExpires = this.authService.getExpireDate(accessToken);
    const refreshToken = this.authService.generateRefreshToken(member);
    const refreshTokenExpires = this.authService.getExpireDate(refreshToken);
    return {
      accessToken,
      accessTokenExpires,
      refreshToken,
      refreshTokenExpires,
    };
  }
}
