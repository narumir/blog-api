import {
  Column,
  Entity,
} from "typeorm";
import {
  BaseEntity,
} from "./base-entity";

@Entity({
  name: "user",
})
export class User extends BaseEntity {

  @Column({
    name: "username",
    nullable: false,
    type: "varchar",
    length: 320,
  })
  username: string;

  @Column({
    name: "password",
    nullable: false,
    type: "bytea",
  })
  password: Buffer;

  @Column({
    name: "salt",
    nullable: false,
    type: "char",
    length: 64,
  })
  salt: string;

  @Column({
    name: "nickname",
    nullable: false,
    type: "varchar",
    length: 32,
  })
  nickname: string;
}