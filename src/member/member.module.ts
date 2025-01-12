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

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, MemberCredential]),
  ],
  controllers: [

  ],
  providers: [
    MemberService,
  ],
  exports: [
    MemberService,
  ],
})
export class MemberModule { }
