import * as argon from "argon2";
import * as jwt from "jsonwebtoken";
import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ConfigService,
} from "@nestjs/config";
import {
  InjectRepository,
} from "@nestjs/typeorm";
import {
  JwtService,
} from "@nestjs/jwt";
import {
  Repository,
} from "typeorm";
import {
  Member,
  MemberCredential,
} from "src/entities";

@Injectable()
export class AuthService {
  private readonly authSecret: Buffer;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(MemberCredential)
    private readonly credentialRepository: Repository<MemberCredential>,
  ) {
    this.authSecret = Buffer.from(this.configService.getOrThrow<string>("authSecret"));
  }

  public async validateUser(username: string, password: string) {
    const credentials = await this.credentialRepository.findOne({
      relations: ["member"],
      where: {
        username,
      },
    });
    if (credentials == null) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const isValidPassword = await this.verifyPassword(credentials.password, password);
    if (!isValidPassword) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return credentials.member;
  }

  public generateAccessToken(member: Member) {
    return this.jwtService.sign({ sub: member.id });
  }

  public generateRefreshToken(member: Member) {
    const refreshTokeneSecret = this.configService.getOrThrow<string>("jwt.refreshTokeneSecret");
    return jwt.sign({ sub: member.id }, refreshTokeneSecret, { expiresIn: "30d" });
  }

  public getExpireDate(token: string) {
    const decode = jwt.decode(token);
    return new Date(parseInt(decode["exp"], 10) * 1000);
  }

  public hashPassword(password: string) {
    return argon.hash(password, { type: argon.argon2id, secret: this.authSecret, memoryCost: 2 ** 16, timeCost: 3, parallelism: 1 });
  }

  private verifyPassword(hash: string, password: string) {
    return argon.verify(hash, password, { secret: this.authSecret });
  }
}
