import {
  ApiProperty,
} from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";

export class UpdatePasswordDTO {

  @ApiProperty({ type: "string", required: true, nullable: false, minLength: 8 })
  @IsString({ message: "currentPassword must be a string" })
  @IsNotEmpty({ message: "currentPassword is a required value" })
  currentPassword: string;

  @ApiProperty({ type: "string", required: true, nullable: false, minLength: 8 })
  @IsString({ message: "newPassword must be a string" })
  @IsNotEmpty({ message: "newPassword is a required value" })
  @MinLength(8, { message: "newPassword must be at least 8 characters long." })
  newPassword: string;
}
