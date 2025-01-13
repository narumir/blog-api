import {
  ApiProperty,
} from "@nestjs/swagger";

export class TokenDTO {

  @ApiProperty({ type: "string" })
  accessToken: string;

  @ApiProperty({ type: "string" })
  accessTokenExpires: Date;

  public static fromData(accessToken: string, accessTokenExpires: Date) {
    const token = new TokenDTO();
    token.accessToken = accessToken;
    token.accessTokenExpires = accessTokenExpires;
    return token;
  }
}
