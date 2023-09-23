import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class CommonEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @CreateDateColumn({
    name: "created_at",
    nullable: false,
    type: "timestamptz",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    nullable: true,
    type: "timestamptz",
  })
  updatedAt: Date;
}
