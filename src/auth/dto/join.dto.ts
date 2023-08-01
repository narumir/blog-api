import {
  ApiProperty,
} from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class JoinDTO {
  @ApiProperty({ description: "사용자 계정", type: String, maximum: 320, minimum: 2, required: true })
  @IsString({ message: "Username must be a string." })
  @MaxLength(320, { message: "Username must be less than 320 characters." })
  @MinLength(2, { message: "Username must be at least 2 characters." })
  @IsNotEmpty({ message: "Username is required." })
  username: string;

  @ApiProperty({ description: "사용자 비밀번호", type: String, required: true })
  @IsString({ message: "Password must be a string." })
  @IsNotEmpty({ message: "Password is required." })
  password: string;

  @ApiProperty({ description: "사용자 닉네임", type: String, maximum: 32, minimum: 2, required: true })
  @IsString({ message: "Nickname must be a string." })
  @MaxLength(32, { message: "Nickname must be less than 32 characters." })
  @MinLength(2, { message: "Nickname must be at least 2 characters." })
  @IsNotEmpty({ message: "Nickname is required." })
  nickname: string;
}
