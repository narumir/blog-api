import {
  Injectable,
} from "@nestjs/common";
import {
  InjectDataSource,
} from "@nestjs/typeorm";
import {
  DataSource,
} from "typeorm";
import {
  Member,
  MemberCredential,
} from "src/entities";

@Injectable()
export class MemberService {

  constructor(
    @InjectDataSource()
    private readonly datasource: DataSource,
  ) { }

  public register(username: string, hash: string, nickname: string) {
    return this.datasource.transaction(async (entityManager) => {
      let member = entityManager.create(Member, { nickname });
      member = await entityManager.save(member);
      let credentials = entityManager.create(MemberCredential, { username, password: hash, member });
      credentials = await entityManager.save(credentials);
      return member;
    });
  }
}
