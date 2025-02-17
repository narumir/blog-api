import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import {
  DefaultEntity,
} from "./default-entity";
import {
  Member,
} from "./member";

export enum ArticleStatus {
  DRAFT = "DRAFT",
  PRIVATE = "PRIVATE",
  PUBLISHED = "PUBLISHED",
};

@Entity({
  name: "article",
})
export class Article extends DefaultEntity {

  @Column({
    type: "enum",
    name: "status",
    nullable: false,
    enum: ArticleStatus,
    default: ArticleStatus.PUBLISHED,
  })
  status: ArticleStatus;

  @Column({
    type: "varchar",
    name: "title",
    nullable: false,
    length: 255,
  })
  title: string;

  @Column({
    type: "text",
    name: "content",
    nullable: false,
  })
  content: string;

  @Column({
    type: "timestamptz",
    name: "published_at",
    nullable: true,
    default: () => "now()",
  })
  publishedAt: Date;

  @ManyToOne(() => Member, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "member_id" })
  member: Member;

  @BeforeInsert()
  @BeforeUpdate()
  handlePublishedAt() {
    if (this.status !== ArticleStatus.PUBLISHED) {
      this.publishedAt = null;
    }
  }
}
