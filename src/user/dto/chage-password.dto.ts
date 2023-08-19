import {
  ApiProperty,
} from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
} from "class-validator";

export class ChangePasswordDTO {
  @ApiProperty({ description: "사용자 비밀번호", type: String, required: true })
  @IsString({ message: "Password must be a string." })
  @IsNotEmpty({ message: "Password is required." })
  password: string;
}
