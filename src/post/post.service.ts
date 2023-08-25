import {
  Injectable,
} from "@nestjs/common";
import {
  InjectRepository,
} from "@nestjs/typeorm";
import {
  MoreThan,
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

  async pagenate(page: number = 1, take: number = 12) {
    const [posts, total] = await this.readonlyPostRepository.findAndCount({
      take,
      skip: (page - 1) * take,
      relations: ["user"],
    });
    return { posts, total, lastPage: Math.ceil(total / take) };
  }

  cursor(cursor?: string, take: number = 12) {
    return this.readonlyPostRepository.find({
      where: {
        ...(cursor != null && { id: MoreThan(cursor) }),
      },
      take,
      order: {
        id: "DESC",
      },
    });
  }

  getPost(id: string) {
    return this.readonlyPostRepository.findOne({
      where: {
        id,
      },
      relations: ["user"],
    });
  }

  removeByUser(id: string, userId: string) {
    return this.postRepository.delete({
      id,
      user: {
        id: userId,
      },
    });
  }
}
