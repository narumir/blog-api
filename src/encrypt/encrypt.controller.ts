import {
  Controller,
  Get,
} from "@nestjs/common";
import {
  Public,
} from "src/auth/auth.guard";
import {
  EncryptService,
} from "./encrypt.service";

@Controller()
export class EncryptController {
  constructor(
    private readonly encryptService: EncryptService,
  ) { }

  @Public()
  @Get("public-key")
  getPublicKey() {
    const publicKey = this.encryptService.getPublicKey();
    return { publicKey };
  }
}
