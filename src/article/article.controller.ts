import {
  Controller,
  Get,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";

@Controller()
export class ArticleController {


  @UseGuards(AuthGuard)
  @Get()
  public async readArticle() {
    return "";
  }
}
