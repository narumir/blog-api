import {
  Column,
  Entity,
} from "typeorm";
import {
  DefaultEntity,
} from "./default-entity";

@Entity({
  name: "member",
})
export class Member extends DefaultEntity {

  @Column({
    type: "varchar",
    name: "nickname",
    nullable: false,
    length: 50,
  })
  nickname: string;

  @Column({
    type: "text",
    name: "profile_image",
    nullable: false,
  })
  profileImage: string;
}
