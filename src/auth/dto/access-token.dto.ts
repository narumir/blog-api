import {
  ApiProperty,
} from "@nestjs/swagger";

export class AccessTokenDTO {

  @ApiProperty({ type: "string" })
  accessToken: string;

  @ApiProperty({ type: "string" })
  accessTokenExpires: Date;

  public static fromData(accessToken: string, accessTokenExpires: Date) {
    const token = new AccessTokenDTO();
    token.accessToken = accessToken;
    token.accessTokenExpires = accessTokenExpires;
    return token;
  }
}
