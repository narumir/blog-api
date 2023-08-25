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
import {
  ErrorCodes,
} from "src/error-code";

export class CreatePostDTO {

  @ApiProperty({ description: "게시글 제목", type: String, maximum: 255, required: true })
  @IsString({ message: ErrorCodes.USER_INPUT_INVALID_TYPE })
  @IsNotEmpty({ message: ErrorCodes.USER_INPUT_EMPTY })
  @MaxLength(255, { message: ErrorCodes.USER_INPUT_TOO_LONG })
  @MinLength(2, { message: ErrorCodes.USER_INPUT_TOO_SHORT })
  title: string;

  @ApiProperty({ description: "게시글 컨텐츠", type: Object, required: true })
  @IsObject({ message: ErrorCodes.USER_INPUT_INVALID_TYPE })
  @IsNotEmpty({ message: ErrorCodes.USER_INPUT_EMPTY })
  content: object;
}
