import {
  ApiProperty,
} from "@nestjs/swagger";

export class TokenRes {

  @ApiProperty({ type: "string" })
  accessToken: string;

  @ApiProperty({ type: "string" })
  accessTokenExpires: Date;
}