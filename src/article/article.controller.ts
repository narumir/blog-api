import {
  Controller,
  Get,
} from "@nestjs/common";

@Controller()
export class ArticleController {


  @Get()
  public async readArticle() {
    return "";
  }
}
