import {
  IsJWT,
  IsNotEmpty,
} from "class-validator";

export class TokenDTO {
  @IsNotEmpty({ message: "Token is required" })
  @IsJWT({ message: "Token is invalid" })
  token: string;
}
