import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from "typeorm";
import {
  DefaultEntity,
} from "./default-entity";
import {
  Member,
} from "./member";

@Entity({
  name: "member_credential",
})
export class MemberCredential extends DefaultEntity {

  @Column({
    type: "varchar",
    name: "username",
    nullable: false,
    length: 50,
    unique: true,
  })
  username: string;

  @Column({
    type: "varchar",
    name: "password",
    nullable: false,
    length: 255,
  })
  password: string;

  @OneToOne(() => Member, { nullable: false })
  @JoinColumn({ name: "member_id" })
  member: Member;
}
