import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import {
  BaseEntity,
} from "./base-entity";
import {
  User,
} from "./user";

@Entity({
  name: "post",
})
export class Post extends BaseEntity {
  @Column({
    type: "varchar",
    name: "title",
    nullable: false,
    length: 255,
  })
  title: string;

  @Column({
    type: "jsonb",
    name: "content",
    nullable: false,
  })
  content: object;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;
}
