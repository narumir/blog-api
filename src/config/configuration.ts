import {
  ConfigModule,
} from "@nestjs/config";

const configuration = () => ({
  port: parseInt(process.env.PORT || "4000", 10),
  db: {
    readonly: {
      host: process.env.DB_READONLY_HOST,
      port: parseInt(process.env.DB_READONLY_PORT || "5432", 10),
      username: process.env.DB_READONLY_USERNAME,
      password: process.env.DB_READONLY_PASSWORD,
    },
    writable: {
      host: process.env.DB_WRITABLE_HOST,
      port: parseInt(process.env.DB_WRITABLE_PORT || "5432", 10),
      username: process.env.DB_WRITABLE_USERNAME,
      password: process.env.DB_WRITABLE_PASSWORD,
    },
  },
  encrypt: {
    publicKey: process.env.RSA_PUBLIC_KEY,
    privateKey: process.env.RSA_PRIVATE_KEY,
  },
});

export default ConfigModule.forRoot({
  load: [configuration],
});
