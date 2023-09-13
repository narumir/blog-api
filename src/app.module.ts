import {
  Module,
} from '@nestjs/common';
import {
  RouterModule,
} from '@nestjs/core';
import {
  EnvConfig,
  ReadonlyDatabase,
  WritableDatabase,
} from './config';
import {
  UserModule,
} from './user/user.module';
import {
  JWTModule,
} from './auth/jwt/jwt.module';
import {
  AuthModule,
} from './auth/auth.module';
import {
  EncryptModule,
} from './encrypt/encrypt.module';
import {
  PostModule,
} from './post/post.module';
import {
  ValidationExceptionFilterProvider,
} from './validation-exception-filter';
import {
  HttpExceptionFilterProvider,
} from './exception-filter';
import {
  HealthModule,
} from './health/health.module';

const Routes = RouterModule.register([
  {
    path: "v1",
    children: [
      {
        path: "users",
        module: UserModule,
      },
      {
        path: "auth",
        module: AuthModule,
      },
      {
        path: "encrypt",
        module: EncryptModule,
      },
      {
        path: "posts",
        module: PostModule,
      },
      {
        path: "health",
        module: HealthModule,
      },
    ],
  },
]);

@Module({
  imports: [
    EnvConfig,
    ReadonlyDatabase,
    WritableDatabase,
    Routes,
    JWTModule,
    UserModule,
    AuthModule,
    EncryptModule,
    PostModule,
    HealthModule,
  ],
  providers: [
    ValidationExceptionFilterProvider,
    HttpExceptionFilterProvider,
  ],
})
export class AppModule { }
