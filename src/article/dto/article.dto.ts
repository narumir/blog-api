import {
  ApiProperty,
} from "@nestjs/swagger";
import {
  Article,
  ArticleStatus,
} from "src/entities";
import {
  MemberDTO,
} from "src/member/dto";

export class ArticleDTO {

  @ApiProperty({ type: "number" })
  id: number;

  @ApiProperty({ type: "string", enum: ArticleStatus })
  status: ArticleStatus;

  @ApiProperty({ type: "string" })
  title: string;

  @ApiProperty({ type: "string" })
  content: string;

  @ApiProperty({ type: MemberDTO })
  member: MemberDTO;

  @ApiProperty({ type: "string" })
  publishedAt: Date;

  public static fromEntity(entity: Article) {
    const article = new ArticleDTO();
    article.id = entity.id;
    article.status = entity.status;
    article.title = entity.title;
    article.content = entity.content;
    article.publishedAt = entity.publishedAt;
    article.member = MemberDTO.fromEntity(entity.member);
    return article;
  }
}
