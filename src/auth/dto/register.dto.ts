import {
  ApiProperty,
} from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from "class-validator";

export class RegisterDTO {

  @ApiProperty({ type: "string", required: true, nullable: false, minLength: 2, maxLength: 50 })
  @IsString({ message: "username must be a string" })
  @IsNotEmpty({ message: "username is a required value" })
  @Length(2, 50, { message: "The username must be at least 2 characters and less than 50 characters" })
  username: string;

  @ApiProperty({ type: "string", required: true, nullable: false, minLength: 8 })
  @IsString({ message: "password must be a string" })
  @IsNotEmpty({ message: "password is a required value" })
  @MinLength(8, { message: "password must be at least 8 characters long." })
  password: string;

  @ApiProperty({ type: "string", required: true, nullable: false, minLength: 2, maxLength: 50 })
  @IsString({ message: "nickname must be a string" })
  @IsNotEmpty({ message: "nickname is a required value" })
  @Length(2, 50, { message: "The nickname must be at least 2 characters and less than 50 characters" })
  nickname: string;
}
