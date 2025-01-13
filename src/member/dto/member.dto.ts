import {
  ApiProperty,
} from "@nestjs/swagger";
import {
  Member,
} from "src/entities";

export class MemberDTO {

  @ApiProperty({ type: "number" })
  id: number;

  @ApiProperty({ type: "string" })
  nickname: string;

  @ApiProperty({ type: "string" })
  profileImage: string;

  public static fromEntity(entity: Member) {
    const member = new MemberDTO();
    member.id = entity.id;
    member.nickname = entity.nickname;
    member.profileImage = entity.profileImage;
    return member;
  }
}
