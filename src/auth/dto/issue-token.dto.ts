import {
  IsNotEmpty,
  IsString,
} from "class-validator";

export class IssueToken {

  @IsString({ message: "refresh token must be a string" })
  @IsNotEmpty({ message: "refresh token is a required value" })
  refreshToken: string;
}
