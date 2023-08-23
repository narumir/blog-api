import {
  Body,
  Controller,
  Post,
  Req,
} from "@nestjs/common";
import {
  FastifyRequest,
} from "fastify";
import {
  ApiBody,
} from "@nestjs/swagger";
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
}
