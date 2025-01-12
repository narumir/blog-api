import {
  ConfigModule,
  ConfigService,
} from "@nestjs/config";
import {
  JwtModule,
} from "@nestjs/jwt";

export const AuthFactory = JwtModule.registerAsync({
  global: true,
  imports: [
    ConfigModule,
  ],
  inject: [
    ConfigService,
  ],
  useFactory: (configService: ConfigService) => ({
    global: true,
    secret: configService.getOrThrow("jwt.accessTokenSecret"),
    signOptions: {
      expiresIn: "1h",
    },
  }),
});
