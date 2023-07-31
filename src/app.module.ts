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

const Routes = RouterModule.register([
  {
    path: "user",
    module: UserModule,
  },
]);

@Module({
  imports: [
    EnvConfig,
    SSMModule,
    ReadonlyDatabase,
    WritableDatabase,
    Routes,
    UserModule,
  ],
})
export class AppModule { }
