import Configuration from "src/config/configuration";
import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import {
  RouterModule,
} from "@nestjs/core";
import {
  ReadonlyDataSource,
  WritableDataSource,
} from "src/config/database";
import {
  UserModule,
} from "./user/user.module";
import {
  AuthModule,
} from "./auth/auth.module";
import {
  AppExceptionFilter,
} from "./app.exception-filter";
import {
  EncryptModule,
} from "./encrypt/encrypt.module";
import {
  JWTFactory,
} from "./jwt/jwt.module";
import {
  JwtMiddleware,
} from "./jwt/jwt.middleware";

const Routes = RouterModule.register([
  {
    path: "v1",
    children: [
      {
        path: "auth",
        module: AuthModule,
      },
      {
        path: "users",
        module: UserModule,
      },
      {
        path: "encrypt",
        module: EncryptModule,
      }
    ],
  },
]);

@Module({
  imports: [
    Configuration,
    ReadonlyDataSource,
    WritableDataSource,
    Routes,
    JWTFactory,
    AuthModule,
    UserModule,
    EncryptModule,
  ],
  providers: [
    AppExceptionFilter,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes("*")
  }
}
