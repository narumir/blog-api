import {
  ConfigModule,
  ConfigService,
} from "@nestjs/config";
import {
  JwtModule,
} from "@nestjs/jwt";

export const JWTModule = JwtModule.registerAsync({
  imports: [
    ConfigModule,
  ],
  inject: [
    ConfigService,
  ],
  useFactory: async (configService: ConfigService) => {
    return {
      global: true,
      signOptions: {
        expiresIn: configService.get("jwt_expires_in"),
        algorithm: "RS512",
      },
      privateKey: configService.get("jwt_private_key").replace(/\\n/g, '\n'),
      publicKey: configService.get("jwt_public_key").replace(/\\n/g, '\n'),
    };
  },
});
