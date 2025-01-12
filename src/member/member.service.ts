import {
  Injectable,
} from "@nestjs/common";
import {
  InjectDataSource,
  InjectRepository,
} from "@nestjs/typeorm";
import {
  DataSource,
  Repository,
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
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
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

  public async withdraw(memberId: number) {
    const result = await this.memberRepository.delete({ id: memberId });
    return result.affected === 1;
  }

  public getMemberById(memberId: number) {
    return this.memberRepository.findOneBy({ id: memberId });
  }
}
