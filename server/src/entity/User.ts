import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column("text")
    email: string;

    @Column("int", { default: 0 })
    tokenVersion: number;

    @Column("text")
    password: string;

}
