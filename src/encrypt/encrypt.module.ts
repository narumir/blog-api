import {
  Module,
} from "@nestjs/common";
import {
  ConfigModule,
} from "@nestjs/config";
import {
  EncryptController,
} from "./encrypt.controller";
import {
  EncryptKeyProvider,
  EncryptService,
} from "./encrypt.service";

@Module({
  imports: [
    ConfigModule,
  ],
  exports: [
    EncryptService,
  ],
  controllers: [
    EncryptController,
  ],
  providers: [
    EncryptService,
    EncryptKeyProvider,
  ],
})
export class EncryptModule { }
