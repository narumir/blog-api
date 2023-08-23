import {
  Body,
  Controller,
  Post,
  Req,
} from "@nestjs/common";
import {
  ApiBody,
} from "@nestjs/swagger";
import type {
  FastifyRequest,
} from "fastify";
import {
  EncryptService,
} from "src/encrypt/encrypt.service";
import {
  UserService,
} from "./user.service";
import {
  ChangePasswordDTO,
} from "./dto";

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly encryptService: EncryptService,
  ) { }

  @ApiBody({ type: ChangePasswordDTO })
  @Post("change-password")
  async changePassword(
    @Req()
    req: FastifyRequest,
    @Body()
    body: ChangePasswordDTO,
  ) {
    const userId: string = req["auth"];
    const password = this.encryptService.decode(body.password);
    await this.userService.changePassword(userId, password);
    return { success: true };
  }
}
