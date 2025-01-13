import {
  ApiProperty,
} from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from "class-validator";
import {
  ArticleStatus,
} from "src/entities";

export class UpdateArticleDTO {

  @ApiProperty({ type: "string", required: true, nullable: false, enum: ArticleStatus, description: "" })
  @IsEnum(ArticleStatus, { message: "status must be one of \"DRAFT\", \"PRIVATE\", or \"PUBLISHED\"" })
  @IsNotEmpty({ message: "status is a required value" })
  status: ArticleStatus;

  @ApiProperty({ type: "string", required: true, nullable: false, maxLength: 255, description: "" })
  @IsString({ message: "title must be a string" })
  @IsNotEmpty({ message: "title is a required value" })
  @MaxLength(255, { message: "title must be less than 255 characters" })
  title: string;

  @ApiProperty({ type: "string", required: true, nullable: false, description: "" })
  @IsString({ message: "content must be a string" })
  @IsNotEmpty({ message: "content is a required value" })
  content: string;
}
