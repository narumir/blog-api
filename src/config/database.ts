import {
  ConfigModule,
  ConfigService,
} from "@nestjs/config";
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
} from "@nestjs/typeorm";
import {
  User,
} from "src/entities";

const databaseDefaultOptions: TypeOrmModuleOptions = {
  type: "postgres",
  database: "blog",
  schema: "public",
  entities: [
    User,
  ],
};

export const ReadonlyDataSource = TypeOrmModule.forRootAsync({
  name: "readonly",
  imports: [
    ConfigModule,
  ],
  inject: [
    ConfigService,
  ],
  useFactory: async (configService: ConfigService) => {
    return {
      name: "readonly",
      host: configService.get("db.readonly.host"),
      port: configService.get<number>("db.readonly.port"),
      username: configService.get("db.readonly.username"),
      password: configService.get("db.readonly.password"),
      synchronize: false,
      ...databaseDefaultOptions,
    };
  },
});

export const WritableDataSource = TypeOrmModule.forRootAsync({
  name: "writable",
  imports: [
    ConfigModule,
  ],
  inject: [
    ConfigService,
  ],

  useFactory: async (configService: ConfigService) => {
    return {
      name: "writable",
      host: configService.get("db.writable.host"),
      port: configService.get<number>("db.writable.port"),
      username: configService.get("db.writable.username"),
      password: configService.get("db.writable.password"),
      synchronize: process.env.NODE_ENV !== "production",
      ...databaseDefaultOptions,
    };
  },
});
