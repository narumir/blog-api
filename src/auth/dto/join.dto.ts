import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class JoinDTO {
  @IsString({ message: "Username must be a string." })
  @MaxLength(320, { message: "Username must be less than 320 characters." })
  @MinLength(2, { message: "Username must be at least 2 characters." })
  @IsNotEmpty({ message: "Username is required." })
  username: string;

  @IsString({ message: "Password must be a string." })
  @IsNotEmpty({ message: "Password is required." })
  password: string;

  @IsString({ message: "Nickname must be a string." })
  @MaxLength(32, { message: "Nickname must be less than 32 characters." })
  @MinLength(2, { message: "Nickname must be at least 2 characters." })
  @IsNotEmpty({ message: "Nickname is required." })
  nickname: string;
}
