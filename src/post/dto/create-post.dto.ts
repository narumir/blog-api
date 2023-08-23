import {
  ApiProperty,
} from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreatePostDTO {

  @ApiProperty({ description: "게시글 제목", type: String, maximum: 255, required: true })
  @IsString({ message: "Title must be a string." })
  @IsNotEmpty({ message: "Title is requried." })
  @MaxLength(255, { message: "Title must be less than 255 characters." })
  @MinLength(2, { message: "Title must be at least 2 characters." })
  title: string;

  @ApiProperty({ description: "게시글 컨텐츠", type: Object, required: true })
  @IsObject({ message: "Content must be a object." })
  @IsNotEmpty({ message: "Content is required." })
  content: object;
}
