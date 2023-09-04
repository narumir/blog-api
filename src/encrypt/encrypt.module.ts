import {
  Module,
  Provider,
} from "@nestjs/common";
import {
  EncryptController,
} from "./encrypt.controller";
import {
  EncryptService,
} from "./encrypt.service";
import {
  ConfigModule,
  ConfigService,
} from "@nestjs/config";

const KeyProvider: Provider = {
  provide: "KEY_PROVIDER",
  inject: [
    ConfigService,
  ],
  useFactory: async (configService: ConfigService) => {
    return {
      publicKey: configService.get("rsa_public_key").replace(/\\n/g, '\n'),
      privateKey: configService.get("rsa_private_key").replace(/\\n/g, '\n'),
    };
  },
}

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
    KeyProvider,
    EncryptService,
  ],
})
export class EncryptModule { }
