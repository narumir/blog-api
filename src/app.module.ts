import {
  Module,
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
  JWTModule,
} from './auth/jwt/jwt.module';
import {
  AuthModule,
} from './auth/auth.module';
import {
  EncryptModule,
} from './encrypt/encrypt.module';

const Routes = RouterModule.register([
  {
    path: "user",
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
    EncryptModule,
  ],
})
export class AppModule { }
