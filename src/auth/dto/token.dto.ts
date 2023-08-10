import {
  ApiProperty,
} from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
} from "class-validator";

export class TokenDTO {
  @ApiProperty({ description: "토큰", type: String, required: true })
  @IsString({ message: "Token must be string." })
  @IsNotEmpty({ message: "Token is required." })
  token: string;
}
