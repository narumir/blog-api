import {
  ConfigFactory,
  ConfigModule,
} from "@nestjs/config";

const config: ConfigFactory = () => ({
  port: 4000,
  region: "ap-northeast-2",
  jwt_expires_in: "1h",
});

export const EnvConfig = ConfigModule.forRoot({
  load: [
    config,
  ],
});
