import {
  Module,
} from "@nestjs/common";
import {
  TypeOrmModule,
} from "@nestjs/typeorm";
import {
  EncryptModule,
} from "src/encrypt/encrypt.module";
import {
  AuthToken,
} from "src/entities";
import {
  AuthController,
} from "./auth.controller";
import {
  AuthService,
} from "./auth.service";
import {
  UserModule,
} from "src/user/user.module";
import {
  JWTFactory,
} from "src/jwt/jwt.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthToken], "readonly"),
    TypeOrmModule.forFeature([AuthToken], "writable"),
    EncryptModule,
    UserModule,
    JWTFactory,
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
  ],
})
export class AuthModule { }
