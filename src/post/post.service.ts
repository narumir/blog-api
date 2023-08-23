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
  Post,
} from "src/entities";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post, "readonly")
    private readonly readonlyPostRepository: Repository<Post>,
    @InjectRepository(Post, "writable")
    private readonly postRepository: Repository<Post>,
  ) { }

  async createPost(userId: string, title: string, content: any) {
    try {
      await this.postRepository.insert({ title, content, user: { id: userId } });
      return true;
    } catch (e) {
      return false;
    }
  }
}
