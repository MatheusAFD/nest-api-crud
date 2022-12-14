import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { hashPasswordTransform } from 'src/helper/crypt';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ transformer: hashPasswordTransform })
  @HideField()
  password: string;
}
