import {
  Column,
  Entity,
  OneToMany,
} from "typeorm";
import {
  CommonEntity,
} from "./common-entity";
import {
  AuthToken,
} from "./auth-token";

@Entity({
  name: "user",
})
export class User extends CommonEntity {

  @Column({
    type: "varchar",
    length: 320,
    nullable: false,
    unique: true,
    name: "email",
  })
  email: string;

  @Column({
    type: "varchar",
    length: 32,
    nullable: false,
    unique: true,
    name: "nickname",
  })
  nickname: string;

  @Column({
    type: "varchar",
    length: 160,
    nullable: true,
    name: "bio",
  })
  bio?: string;

  @Column({
    type: "text",
    nullable: false,
    name: "profile",
  })
  profile: string;

  @Column({
    type: "bytea",
    nullable: false,
    name: "password",
    select: false,
  })
  password: Buffer;

  @Column({
    type: "bytea",
    nullable: false,
    name: "salt",
    select: false,
  })
  salt: Buffer;

  @OneToMany(() => AuthToken, (token) => token.user, { onDelete: "CASCADE" })
  tokens: AuthToken[];
}
