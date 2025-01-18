import {
  ApiProperty,
} from "@nestjs/swagger";

export class TokenDTO {

  @ApiProperty({ type: "string" })
  accessToken: string;

  @ApiProperty({ type: "string" })
  accessTokenExpires: Date;

  @ApiProperty({ type: "string" })
  refreshToken: string;

  @ApiProperty({ type: "string" })
  refreshTokenExpires: Date;

  public static fromData(accessToken: string, accessTokenExpires: Date, refreshToken: string, refreshTokenExpires: Date) {
    const token = new TokenDTO();
    token.accessToken = accessToken;
    token.accessTokenExpires = accessTokenExpires;
    token.refreshToken = refreshToken;
    token.refreshTokenExpires = refreshTokenExpires;
    return token;
  }
}
