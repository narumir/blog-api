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
  Article,
} from "src/entities";

@Injectable()
export class ArticleService {

  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) { }
}
