import {
  Injectable,
} from "@nestjs/common";
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
  UAParser,
} from "ua-parser-js";
import {
  Request,
} from "express";
import {
  AuthToken,
  User,
} from "src/entities";
import {
  unabledWords,
} from "./auth.reserved";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthToken, "readonly")
    private readonly readonlyAuthRepository: Repository<AuthToken>,
    @InjectRepository(AuthToken, "writable")
    private readonly authRepository: Repository<AuthToken>,
    private readonly jwtService: JwtService,
  ) { }

  public async issueRefreshToken(user: User) {
    const payload = {
      sub: user.id,
      nickname: user.nickname,
    };
    const token = await this.jwtService.signAsync(payload, { expiresIn: "1d" });
    const decode = this.jwtService.decode(token);
    const expiredAt = new Date(parseInt(decode["exp"], 10) * 1000);
    return { token, expiredAt };
  }

  public async issueAccessToken(user: User) {
    const payload = {
      sub: user.id,
      nickname: user.nickname,
    };
    const token = await this.jwtService.signAsync(payload);
    const decode = this.jwtService.decode(token);
    const expiredAt = new Date(parseInt(decode["exp"], 10) * 1000);
    return { token, expiredAt };
  }
  public findOneByToken(token: string) {
    return this.readonlyAuthRepository.findOneBy({ token });
  }

  public saveRefreshToken(user: User, token: string, expiredAt: Date, agent: string, ip: string) {
    const { browser, browserVersion, os, osVersion } = this.parseAgent(agent);
    const authToken = new AuthToken();
    authToken.browser = browser;
    authToken.browserVersion = browserVersion;
    authToken.os = os;
    authToken.osVersion = osVersion;
    authToken.token = token;
    authToken.ip = ip;
    authToken.expiredAt = expiredAt;
    authToken.user = user;
    return this.authRepository.save(authToken);
  }

  public checkReservedWord(text: string) {
    for (let i = 0; i < unabledWords.length; i++) {
      if (text.includes(unabledWords[i])) {
        return true;
      }
    }
    return false;
  }

  public discardRefreshToken(token: string) {
    return this.authRepository.delete({ token });
  }

  public getAgentAndIP(req: Request) {
    const agent = req.headers["user-agent"];
    const ip = req.headers["cf-connecting-ip"] as string
      ?? req.headers["x-forwarded-for"] as string
      ?? req.ip;
    return {
      agent,
      ip,
    };
  }

  private parseAgent(agent: string) {
    const parser = new UAParser(agent);
    const { browser, os } = parser.getResult();
    return {
      browser: browser.name,
      browserVersion: browser.version,
      os: os.name,
      osVersion: os.version,
    };
  }
}
