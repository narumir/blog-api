import {
  Column,
  Entity,
  OneToMany,
} from "typeorm";
import {
  BaseEntity,
} from "./base-entity";
import {
  AuthToken,
  Post,
} from "src/entities";

@Entity({
  name: "user",
})
export class User extends BaseEntity {

  @Column({
    name: "username",
    nullable: false,
    type: "varchar",
    length: 320,
    unique: true,
    select: false,
  })
  username: string;

  @Column({
    name: "password",
    nullable: false,
    type: "bytea",
    select: false,
  })
  password: Buffer;

  @Column({
    name: "salt",
    nullable: false,
    type: "char",
    length: 64,
    select: false,
  })
  salt: string;

  @Column({
    name: "nickname",
    nullable: false,
    type: "varchar",
    length: 32,
  })
  nickname: string;

  @OneToMany(() => AuthToken, (token) => token.user, { onDelete: "CASCADE" })
  tokens: AuthToken[];

  @OneToMany(() => Post, (post) => post.user, { onDelete: "CASCADE" })
  posts: Post[];
}
