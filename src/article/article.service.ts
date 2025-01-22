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
import type {
  Block,
} from "./blocknote";

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
    const result = await this.articleRepository.delete({ id: article.id });
    return result.affected === 1;
  }

  public extractParagraph(content: string) {
    const blocks: Block[] = JSON.parse(content);
    return blocks
      .map((block) => {
        if (block.type === "paragraph" && Array.isArray(block.content)) {
          return block.content
            .filter((v) => v.type === "text")
            .map((value) => value.text)
            .join(" ");
        }
      })
      .filter((v) => v != null)
      .join(" ");
  }

  public async getInfo() {
    const total = await this.articleRepository.countBy({ status: ArticleStatus.PUBLISHED });
    return {
      total,
    };
  }
}
