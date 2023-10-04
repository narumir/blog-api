import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class SignUpDTO {
  @IsEmail(undefined, { message: "Email is invalid." })
  @IsNotEmpty({ message: "Email is required." })
  email: string;

  @IsString({ message: "Nickname must be a string." })
  @MaxLength(32, { message: "Nickname must be less than 32 characters." })
  @MinLength(2, { message: "Nickname must be at least 2 characters." })
  @IsNotEmpty({ message: "Nickname is required." })
  nickname: string;

  @IsString({ message: "Password must be a string." })
  @IsNotEmpty({ message: "Password is required." })
  password: string;
}
