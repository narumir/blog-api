import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Patch,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from "@nestjs/swagger";
import {
  AuthGuard,
  UserAuth,
} from "src/auth/auth.guard";
import {
  MemberService,
} from "./member.service";
import {
  MemberDTO,
  UpdateMemberDTO,
} from "./dto";

@ApiTags("Member")
@Controller()
export class MemberController {

  constructor(
    private readonly memberService: MemberService,
  ) { }

  @ApiOperation({ summary: "update profile", description: "update profile" })
  @ApiConsumes("application/json")
  @ApiProduces("application/json")
  @ApiBearerAuth()
  @ApiBody({ type: UpdateMemberDTO })
  @ApiOkResponse({ type: MemberDTO })
  @UseGuards(AuthGuard)
  @Patch()
  @HttpCode(HttpStatus.OK)
  public async updateProfile(
    @UserAuth() memberId: number,
    @Body() body: UpdateMemberDTO,
  ) {
    const result = await this.memberService.updateProfile(memberId, body.nickname, body.profileImage);
    if (!result) {
      throw new InternalServerErrorException("update not affected");
    }
    const member = await this.memberService.getMemberById(memberId);
    return MemberDTO.fromEntity(member);
  }

  @ApiOperation({ summary: "get profile", description: "get profile" })
  @ApiProduces("application/json")
  @ApiBearerAuth()
  @ApiOkResponse({ type: MemberDTO })
  @UseGuards(AuthGuard)
  @Get("/profile")
  @HttpCode(HttpStatus.OK)
  public async readProfile(
    @UserAuth() memberId: number,
  ) {
    const profile = await this.memberService.getMemberById(memberId);
    return MemberDTO.fromEntity(profile);
  }
}
