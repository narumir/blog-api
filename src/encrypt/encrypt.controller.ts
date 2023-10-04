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

  @Get("publickey")
  public getPublicKey() {
    return this.encryptService.getPublicKey();
  }
}
