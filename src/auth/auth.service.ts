import argon from "argon2";
import {
  Injectable,
} from "@nestjs/common";
import {
  JwtService,
} from "@nestjs/jwt";
import {
  InjectRepository,
} from "@nestjs/typeorm";
import {
  Repository,
} from "typeorm";
import {
  UAParser,
} from "ua-parser-js";
import type {
  Request,
} from "express";
import {
  AuthToken,
  User,
} from "src/entities";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(AuthToken, "readonly")
    private readonly readonlyTokenRepository: Repository<AuthToken>,
    @InjectRepository(AuthToken, "writable")
    private readonly tokenRepository: Repository<AuthToken>,
  ) { }

  async verifyPassword(user: User, password: string) {
    const salt = Buffer.from(user.salt, "hex");
    const encryptedPasswrod = await argon.hash(password, { salt, type: argon.argon2id, raw: true });
    return user.password.compare(encryptedPasswrod) === 1;
  }

  saveRefreshToken(user: User, token: string, expiredAt: Date, agent: string, ip: string) {
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
    return this.tokenRepository.save(authToken);
  }

  async issueAccessToken(user: User) {
    const payload = {
      sub: user.id,
      nickname: user.nickname,
    };
    const token = await this.jwtService.signAsync(payload);
    const decode = this.jwtService.decode(token);
    const expiredAt = new Date(parseInt(decode["exp"], 10) * 1000);
    return {
      accessToken: token,
      expiredAt,
    };
  }

  async issueRefreshToken(user: User) {
    const payload = {
      sub: user.id,
      nickname: user.nickname,
    };
    const token = await this.jwtService.signAsync(payload, { expiresIn: "1d" });
    const decode = this.jwtService.decode(token);
    const expiredAt = new Date(parseInt(decode["exp"], 10) * 1000);
    return {
      refreshToken: token,
      expiredAt,
    };
  }

  getAgentAndIP(req: Request) {
    const agent = req.headers["user-agent"];
    const ip = req.headers["cf-connecting-ip"] as string
      ?? req.headers["x-forwarded-for"] as string
      ?? req.socket.remoteAddress;
    return {
      agent,
      ip,
    };
  }

  private parseAgent(agent: string) {
    const parser = new UAParser(agent);
    const {
      browser,
      os,
    } = parser.getResult();
    return {
      browser: browser.name,
      browserVersion: browser.version,
      os: os.name,
      osVersion: os.version,
    };
  }
}
