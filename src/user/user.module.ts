import {
  Module,
} from "@nestjs/common";
import {
  TypeOrmModule,
} from "@nestjs/typeorm";
import {
  User,
} from "src/entities";
import {
  EncryptModule,
} from "src/encrypt/encrypt.module";
import {
  UserService,
} from "./user.service";
import {
  UserController,
} from "./user.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([User], "readonly"),
    TypeOrmModule.forFeature([User], "writable"),
    EncryptModule,
  ],
  exports: [
    UserService,
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
  ],
})
export class UserModule { }
