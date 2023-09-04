import {
  ConfigModule,
  ConfigService,
} from "@nestjs/config";
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
} from "@nestjs/typeorm";
import {
  AuthToken,
  User,
  Post,
} from "src/entities";

const defaultOptions: TypeOrmModuleOptions = {
  type: "postgres",
  database: "blog",
  schema: "public",
  entities: [
    User,
    AuthToken,
    Post,
  ],
};

export const ReadonlyDatabase = TypeOrmModule.forRootAsync({
  name: "readonly",
  imports: [
    ConfigModule,
  ],
  inject: [
    ConfigService,
  ],
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
    return {
      name: "readonly",
      host: configService.get("db_readonly_host"),
      port: parseInt(configService.get("db_readonly_port"), 10),
      username: configService.get("db_readonly_username"),
      password: configService.get("db_readonly_password"),
      synchronize: false,
      ...defaultOptions,
    };
  },
});

export const WritableDatabase = TypeOrmModule.forRootAsync({
  name: "writable",
  imports: [
    ConfigModule,
  ],
  inject: [
    ConfigService,
  ],
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
    return {
      name: "writable",
      host: configService.get("db_writable_host"),
      port: parseInt(configService.get("db_writable_port"), 10),
      username: configService.get("db_writable_username"),
      password: configService.get("db_writable_password"),
      synchronize: process.env.NODE_ENV !== "production",
      ...defaultOptions,
    };
  },
});
