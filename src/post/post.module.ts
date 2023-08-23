import {
  Module,
} from "@nestjs/common"
import {
  TypeOrmModule,
} from "@nestjs/typeorm";
import {
  Post,
} from "src/entities";
import {
  PostController,
} from "./post.controller";
import {
  PostService,
} from "./post.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Post], "readonly"),
    TypeOrmModule.forFeature([Post], "writable"),
  ],
  controllers: [
    PostController,
  ],
  providers: [
    PostService,
  ],
})
export class PostModule { }
