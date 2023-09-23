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

}
