import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  AuthGuard,
  UserAuth,
} from "src/auth/auth.guard";
import {
  ArticleStatus,
} from "src/entities";
import {
  ArticleService,
} from "./article.service";
import {
  ArticleDTO,
  ArticleInfoDTO,
  UpdateArticleDTO,
  WriteArticleDTO,
} from "./dto";

@ApiTags("Article")
@Controller()
export class ArticleController {

  constructor(
    private readonly articleService: ArticleService,
  ) { }

  @ApiOperation({ summary: "write an ariticle", description: "write an article" })
  @ApiBearerAuth()
  @ApiConsumes("application/json")
  @ApiProduces("application/json")
  @ApiBody({ type: WriteArticleDTO })
  @ApiOkResponse({ type: ArticleDTO })
  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  public async writeArticle(
    @UserAuth() memberId: number,
    @Body() body: WriteArticleDTO,
  ) {
    const result = await this.articleService.writeArticle(memberId, body.status, body.title, body.content);
    const article = await this.articleService.readArticle(result.id);
    return ArticleDTO.fromEntity(article);
  }

  @ApiOperation({ summary: "read articles", description: "read articles" })
  @ApiQuery({ name: "last", type: "number", required: false })
  @ApiProduces("application/json")
  @ApiOkResponse({ type: [ArticleDTO] })
  @Get()
  @HttpCode(HttpStatus.OK)
  public async readArticles(
    @Query("last", new ParseIntPipe({ optional: true })) lastId?: number,
  ) {
    let articles = await this.articleService.readArticles(lastId);
    articles = articles.map((article) => {
      article.content = this.articleService.extractParagraph(article.content);
      return article;
    })
    return articles.map((article) => ArticleDTO.fromEntity(article));
  }

  @ApiOperation({ summary: "read an article", description: "read an article" })
  @ApiProduces("application/json")
  @ApiParam({ name: "article_id", })
  @ApiOkResponse({ type: ArticleDTO })
  @Get(":article_id")
  @HttpCode(HttpStatus.OK)
  public async readArticle(
    @Param("article_id", new ParseIntPipe()) articleId: number,
  ) {
    const article = await this.articleService.readArticle(articleId);
    if (article == null) {
      throw new NotFoundException("article not found");
    }
    if (article.status !== ArticleStatus.PUBLISHED) {
      throw new NotFoundException("article not found");
    }
    return ArticleDTO.fromEntity(article);
  }

  @ApiOperation({ summary: "update article", description: "update article" })
  @ApiConsumes("application/json")
  @ApiProduces("application/json")
  @ApiParam({ name: "article_id", type: "number" })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateArticleDTO })
  @ApiOkResponse({ type: ArticleDTO })
  @UseGuards(AuthGuard)
  @Patch(":article_id")
  @HttpCode(HttpStatus.OK)
  public async updateArticle(
    @UserAuth() memberId: number,
    @Param("article_id", new ParseIntPipe()) articleId: number,
    @Body() body: UpdateArticleDTO,
  ) {
    const article = await this.articleService.readArticle(articleId);
    if (article == null) {
      throw new NotFoundException("article not found");
    }
    if (article.member.id !== memberId) {
      throw new ForbiddenException("no permission to update this article");
    }
    const result = await this.articleService.updateArticle(article, body.status, body.title, body.content);
    return ArticleDTO.fromEntity(result);
  }

  @ApiOperation({ summary: "delete article", description: "delete article" })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @UseGuards(AuthGuard)
  @Delete(":article_id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteArticle(
    @UserAuth() memberId: number,
    @Param("article_id", new ParseIntPipe()) articleId: number,
  ) {
    const article = await this.articleService.readArticle(articleId);
    if (article == null) {
      throw new NotFoundException("article not found");
    }
    if (article.member.id !== memberId) {
      throw new ForbiddenException("no permission to delete this article");
    }
    await this.articleService.deleteArticle(article);
    return;
  }

  @ApiOperation({ summary: "article info", description: "article info" })
  @ApiOkResponse({ type: ArticleInfoDTO })
  @Get("info")
  @HttpCode(HttpStatus.OK)
  public async getInfo() {
    const info = await this.articleService.getInfo();
    return ArticleInfoDTO.fromData(info.total);
  }
}
