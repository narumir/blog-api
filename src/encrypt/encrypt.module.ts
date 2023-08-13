import {
  Module,
  Provider,
} from "@nestjs/common";
import {
  SSMModule,
  SSMService,
} from "src/config";
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
    SSMService,
  ],
  useFactory: async (configService: ConfigService, ssmService: SSMService) => {
    const parameters = await ssmService.getEncryptParameters();
    return {
      publicKey: (parameters["rsa_public_key"] ?? configService.get("rsa_public_key")).replace(/\\n/g, '\n'),
      privateKey: (parameters["rsa_private_key"] ?? configService.get("rsa_private_key")).replace(/\\n/g, '\n'),
    };
  },
}

@Module({
  imports: [
    ConfigModule,
    SSMModule,
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
