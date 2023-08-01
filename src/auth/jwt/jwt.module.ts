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
    const parameters = await ssmService.getParameters();
    return {
      global: true,
      signOptions: {
        expiresIn: parameters["jwt_expires_in"] ?? configService.get("jwt_expires_in"),
      },
      secret: parameters["jwt_secret"] ?? configService.get("jwt_secret"),
    };
  },
})