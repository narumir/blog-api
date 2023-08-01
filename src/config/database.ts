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
} from "src/entities";
import {
  SSMModule,
} from "./ssm.module";
import {
  SSMService,
} from "./ssm.service";

const defaultOptions: TypeOrmModuleOptions = {
  type: "postgres",
  database: "blog",
  schema: "public",
  synchronize: process.env.NODE_ENV !== "production",
  entities: [
    User,
    AuthToken,
  ],
};

export const ReadonlyDatabase = TypeOrmModule.forRootAsync({
  name: "readonly",
  imports: [
    ConfigModule,
    SSMModule,
  ],
  inject: [
    ConfigService,
    SSMService,
  ],
  useFactory: async (configService: ConfigService, ssmService: SSMService): Promise<TypeOrmModuleOptions> => {
    const parameters = await ssmService.getParameters();
    return {
      name: "readonly",
      host: parameters["db_readonly_host"] ?? configService.get("db_readonly_host"),
      port: parseInt(parameters["db_readonly_port"] ?? configService.get("db_readonly_port"), 10),
      username: parameters["db_readonly_username"] ?? configService.get("db_readonly_username"),
      password: parameters["db_readonly_password"] ?? configService.get("db_readonly_password"),
      ...defaultOptions,
    };
  },
});

export const WritableDatabase = TypeOrmModule.forRootAsync({
  name: "writable",
  imports: [
    ConfigModule,
    SSMModule,
  ],
  inject: [
    ConfigService,
    SSMService,
  ],
  useFactory: async (configService: ConfigService, ssmService: SSMService): Promise<TypeOrmModuleOptions> => {
    const parameters = await ssmService.getParameters();
    return {
      name: "writable",
      host: parameters["db_writable_host"] ?? configService.get("db_writable_host"),
      port: parseInt(parameters["db_writable_port"] ?? configService.get("db_writable_port"), 10),
      username: parameters["db_writable_username"] ?? configService.get("db_writable_username"),
      password: parameters["db_writable_password"] ?? configService.get("db_writable_password"),
      ...defaultOptions,
    };
  },
});
