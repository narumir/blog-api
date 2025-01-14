import {
  Injectable,
} from "@nestjs/common";
import {
  InjectRepository,
} from "@nestjs/typeorm";
import {
  LessThan,
  Repository,
} from "typeorm";
import {
  Article,
  ArticleStatus,
} from "src/entities";

@Injectable()
export class ArticleService {

  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) { }

  public writeArticle(memberId: number, status: ArticleStatus, title: string, content: string) {
    const article = this.articleRepository.create({
      title,
      content,
      status,
      ...(status !== ArticleStatus.PUBLISHED && { publishedAt: null }),
      member: {
        id: memberId,
      },
    });
    return this.articleRepository.save(article);
  }

  public readArticle(articleId: number) {
    return this.articleRepository.findOne({
      relations: ["member"],
      where: {
        id: articleId,
      },
    });
  }

  public readArticles(lastId?: number) {
    return this.articleRepository.find({
      relations: ["member"],
      where: {
        status: ArticleStatus.PUBLISHED,
        ...(lastId != null && { id: LessThan(lastId) }),
      },
      order: {
        id: "DESC",
      },
      take: 10,
    });
  }

  public async updateArticle(article: Article, status: ArticleStatus, title: string, content: string) {
    if (article.status !== status && status === ArticleStatus.PUBLISHED) {
      article.publishedAt = new Date();
    }
    article.status = status;
    article.title = title;
    article.content = content;
    return this.articleRepository.save(article);
  }

  public async deleteArticle(article: Article) {
    const result = await this.articleRepository.delete(article);
    return result.affected === 1;
  }
}
