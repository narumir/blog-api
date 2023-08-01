import {
  Module,
} from "@nestjs/common";
import {
  TypeOrmModule,
} from "@nestjs/typeorm";
import {
  AuthToken,
} from "src/entities";
import {
  UserModule,
} from "src/user/user.module";
import {
  AuthController,
} from "./auth.controller";
import {
  AuthService,
} from "./auth.service";
import {
  JWTModule,
} from "./jwt/jwt.module";

@Module({
  imports: [
    JWTModule,
    UserModule,
    TypeOrmModule.forFeature([AuthToken], "readonly"),
    TypeOrmModule.forFeature([AuthToken], "writable"),
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
  ],
})
export class AuthModule { }
