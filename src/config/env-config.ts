import {
  ConfigFactory,
  ConfigModule,
} from "@nestjs/config";

const config: ConfigFactory = () => ({
  port: 4000,
});

export const EnvConfig = ConfigModule.forRoot({
  load: [
    config,
  ],
});
