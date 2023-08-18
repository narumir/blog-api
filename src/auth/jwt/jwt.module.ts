import {
  ConfigModule,
  ConfigService,
} from "@nestjs/config";
import {
  JwtModule,
} from "@nestjs/jwt";
import {
  SSMModule,
  SSMService,
} from "src/config";

export const JWTModule = JwtModule.registerAsync({
  imports: [
    ConfigModule,
    SSMModule,
  ],
  inject: [
    ConfigService,
    SSMService,
  ],
  useFactory: async (configService: ConfigService, ssmService: SSMService) => {
    const parameters = await ssmService.getAuthParameters();
    return {
      global: true,
      signOptions: {
        expiresIn: parameters["jwt_expires_in"] ?? configService.get("jwt_expires_in"),
        algorithm: "RS512",
      },
      privateKey: parameters["jwt_private_key"] ?? configService.get("jwt_private_key").replace(/\\n/g, '\n'),
      publicKey: parameters["jwt_public_key"] ?? configService.get("jwt_public_key").replace(/\\n/g, '\n'),
    };
  },
});
