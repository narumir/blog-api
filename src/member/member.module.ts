import {
  Module,
} from "@nestjs/common";
import {
  TypeOrmModule,
} from "@nestjs/typeorm";
import {
  Member,
  MemberCredential,
} from "src/entities";
import {
  MemberService,
} from "./member.service";
import {
  MemberController,
} from "./member.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, MemberCredential]),
  ],
  controllers: [
    MemberController,
  ],
  providers: [
    MemberService,
  ],
  exports: [
    MemberService,
  ],
})
export class MemberModule { }
