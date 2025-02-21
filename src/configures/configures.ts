import {
  ConfigModule,
} from "@nestjs/config"

const environments = () => ({
  port: parseInt(process.env.PORT || "4000", 10),
  isProduction: process.env.NODE_ENV === "production",
  authSecret: process.env.AUTH_SECRET,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || "5432", 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokeneSecret: process.env.REFRESH_TOKEN_SECRET,
  },
});

export const Configure = ConfigModule.forRoot({
  load: [
    environments,
  ],
});
