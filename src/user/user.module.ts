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
  UserController,
} from "./user.controller";
import {
  UserService,
} from "./user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User], "readonly"),
    TypeOrmModule.forFeature([User], "writable"),
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
