import {
  Controller,
  Get,
} from "@nestjs/common";
import {
  EncryptService,
} from "./encrypt.service";

@Controller()
export class EncryptController {
  constructor(
    private readonly encryptService: EncryptService,
  ) { }

  @Get("public-key")
  getPublicKey() {
    const publicKey = this.encryptService.getPublicKey();
    return { publicKey };
  }
}
