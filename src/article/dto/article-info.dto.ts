import {
  ApiProperty,
} from "@nestjs/swagger";

export class ArticleInfoDTO {

  @ApiProperty({ type: "number", description: "number of published articles" })
  total: number;

  public static async fromData(total: number) {
    const articleInfo = new ArticleInfoDTO();
    articleInfo.total = total;
    return articleInfo;
  }
}