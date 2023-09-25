import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from "class-validator";

export class SignInDTO {
  @IsEmail(undefined, { message: "Email is invalid." })
  @IsNotEmpty({ message: "Email is required." })
  email: string;

  @IsString({ message: "Password must be a string." })
  @IsNotEmpty({ message: "Password is required." })
  password: string;
}
