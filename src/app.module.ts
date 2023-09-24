import Configuration from "src/config/configuration";
import {
  Module,
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
    ],
  },
]);

@Module({
  imports: [
    Configuration,
    ReadonlyDataSource,
    WritableDataSource,
    Routes,
    AuthModule,
    UserModule,
  ],
  providers: [
    AppExceptionFilter,
  ],
})
export class AppModule { }
