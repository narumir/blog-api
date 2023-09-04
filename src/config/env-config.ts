import {
  ConfigFactory,
  ConfigModule,
} from "@nestjs/config";

const config: ConfigFactory = () => ({
  port: 4000,
  region: "ap-northeast-2",
  jwt_expires_in: "1h",
  jwt_private_key: process.env.JWT_PRIVATE_KEY,
  jwt_public_key: process.env.JWT_PUBLIC_KEY,
  rsa_private_key: process.env.RSA_PRIVATE_KEY,
  rsa_public_key: process.env.RSA_PUBLIC_KEY,
  db_writable_host: process.env.DB_WRITABLE_HOST,
  db_writable_port: process.env.DB_WRITABLE_PORT,
  db_writable_username: process.env.DB_WRITABLE_USERNAME,
  db_writable_password: process.env.DB_WRITABLE_PASSWORD,
  db_readonly_host: process.env.DB_READONLY_HOST,
  db_readonly_port: process.env.DB_READONLY_PORT,
  db_readonly_username: process.env.DB_READONLY_USERNAME,
  db_readonly_password: process.env.DB_READONLY_PASSWORD,
});

export const EnvConfig = ConfigModule.forRoot({
  load: [
    config,
  ],
});
