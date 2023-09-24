import crypto from "crypto";
import argon from "argon2";
import {
  Injectable,
} from "@nestjs/common";
import {
  InjectRepository,
} from "@nestjs/typeorm";
import {
  Repository,
} from "typeorm";
import {
  User,
} from "src/entities";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, "readonly")
    private readonly readonlyUserRepository: Repository<User>,
    @InjectRepository(User, "writable")
    private readonly userRepository: Repository<User>,
  ) { }

  public async createUser(email: string, nickname: string, password: string) {
    const user = new User();
    user.email = email;
    user.nickname = nickname;
    user.profile = "/profile.webp";
    const salt = crypto.randomBytes(32);
    user.password = await argon.hash(password, { salt, type: argon.argon2id, raw: true });
    user.salt = salt;
    return this.userRepository.save(user);
  }
}
