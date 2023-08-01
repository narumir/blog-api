import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import {
  RouterModule,
} from '@nestjs/core';
import {
  EnvConfig,
  ReadonlyDatabase,
  SSMModule,
  WritableDatabase,
} from './config';
import {
  UserModule,
} from './user/user.module';
import {
  JWTMiddleware,
} from './auth/jwt/jwt.middleware';
import {
  JWTModule,
} from './auth/jwt/jwt.module';
import {
  AuthModule,
} from './auth/auth.module';

const Routes = RouterModule.register([
  {
    path: "user",
    module: UserModule,
  },
  {
    path: "auth",
    module: AuthModule,
  }
]);

@Module({
  imports: [
    EnvConfig,
    SSMModule,
    ReadonlyDatabase,
    WritableDatabase,
    Routes,
    JWTModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JWTMiddleware)
      .forRoutes({
        path: "*",
        method: RequestMethod.ALL,
      })
  }
}
