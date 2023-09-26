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

  public async verifyPassword(user: User, password) {
    const encryptedPasswrod = await argon.hash(password, { salt: user.salt, type: argon.argon2id, raw: true });
    return user.password.equals(encryptedPasswrod);
  }

  public findOneByEmail(email: string) {
    return this.readonlyUserRepository.findOneBy({ email });
  }

  /** auth */
  public signWithEmail(email: string) {
    return this.readonlyUserRepository.createQueryBuilder("user")
      .where("user.email = :email", { email })
      .addSelect(["user.salt", "user.password"])
      .getOne();
  }

  public findOneByNickname(nickname: string) {
    return this.readonlyUserRepository.findOneBy({ nickname });
  }
}
