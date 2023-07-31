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
  UserService,
} from "./user.service";
import {
  UserController,
} from "./user.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([User], "readonly"),
    TypeOrmModule.forFeature([User], "writable"),
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
  ],
})
export class UserModule { }
