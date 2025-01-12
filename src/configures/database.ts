import {
  ConfigModule,
  ConfigService,
} from "@nestjs/config";
import {
  TypeOrmModule,
} from "@nestjs/typeorm";
import {
  EntitySchema,
  MixedList,
} from "typeorm";
import {
  Article,
} from "src/entities";

const entities: MixedList<string | Function | EntitySchema<any>> = [
  Article,
];

export const DataSourse = TypeOrmModule.forRootAsync({
  imports: [
    ConfigModule,
  ],
  inject: [
    ConfigService,
  ],
  useFactory: (configService: ConfigService) => ({
    type: "postgres",
    database: "blog",
    schema: "public",
    host: configService.getOrThrow<string>("database.host"),
    port: configService.getOrThrow<number>("database.port"),
    username: configService.getOrThrow<string>("database.username"),
    password: configService.getOrThrow<string>("database.password"),
    synchronize: !configService.getOrThrow<boolean>("isProduction"),
    logging: !configService.getOrThrow<boolean>("isProduction"),
    entities,
  }),
});
