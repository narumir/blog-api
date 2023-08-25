import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import {
  FastifyRequest,
} from "fastify";
import {
  ApiBody,
} from "@nestjs/swagger";
import {
  Public,
} from "src/auth/auth.guard";
import {
  ErrorCodes,
} from "src/error-code";
import {
  CreatePostDTO,
} from "./dto";
import {
  PostService,
} from "./post.service";

@Controller()
export class PostController {

  constructor(
    private readonly postService: PostService,
  ) { }

  @ApiBody({ type: CreatePostDTO })
  @Post()
  async createPost(
    @Req()
    req: FastifyRequest,
    @Body()
    body: CreatePostDTO,
  ) {
    const userId: string = req["auth"];
    const result = await this.postService.createPost(userId, body.title, body.content);
    return { success: result };
  }

  @Public()
  @Get()
  async getPostsPagenation(
    @Query("cursor")
    cursor?: string,
  ) {
    const posts = await this.postService.cursor(cursor);
    return posts;
  }

  @Public()
  @Get(":id")
  async getPost(
    @Param("id")
    id: string,
  ) {
    const post = await this.postService.getPost(id);
    if (post == null) {
      throw new HttpException(ErrorCodes.NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }
    return post;
  }
}
