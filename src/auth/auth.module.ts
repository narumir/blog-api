import {
  Module,
} from "@nestjs/common";
import {
  ConfigModule,
} from "@nestjs/config";
import {
  TypeOrmModule,
} from "@nestjs/typeorm";
import {
  Member,
  MemberCredential,
} from "src/entities";
import {
  AuthController,
} from "./auth.controller";
import {
  AuthService,
} from "./auth.service";
import {
  AuthFactory,
} from "./auth.factory";
import {
  MemberModule,
} from "src/member/member.module";

@Module({
  imports: [
    ConfigModule,
    AuthFactory,
    MemberModule,
    TypeOrmModule.forFeature([MemberCredential, Member]),
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
  ],
})
export class AuthModule { }
