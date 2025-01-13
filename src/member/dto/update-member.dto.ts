import {
  ApiProperty,
} from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  Length,
} from "class-validator";

export class UpdateMemberDTO {

  @ApiProperty({ type: "string", required: true, nullable: false, minLength: 2, maxLength: 50 })
  @IsString({ message: "nickname must be a string" })
  @IsNotEmpty({ message: "nickname is a required value" })
  @Length(2, 50, { message: "The nickname must be at least 2 characters and less than 50 characters" })
  nickname: string;

  @ApiProperty({ type: "string", required: true, nullable: false })
  @IsString({ message: "profileImage must be a string" })
  @IsNotEmpty({ message: "profileImage is a required value" })
  profileImage: string;
}
