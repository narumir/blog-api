import {
  ConfigModule,
  ConfigService,
} from "@nestjs/config";
import {
  JwtModule,
} from "@nestjs/jwt";

export const JWTFactory = JwtModule.registerAsync({
  imports: [
    ConfigModule,
  ],
  inject: [
    ConfigService,
  ],
  useFactory: async (configService: ConfigService) => ({
    global: true,
    signOptions: {
      expiresIn: configService.get("jwt.expires_in"),
      algorithm: "RS512",
    },
    privateKey: configService.get("jwt.privatekey").replace(/\\n/g, '\n'),
    publicKey: configService.get("jwt.publickey").replace(/\\n/g, '\n')
  }),
});
