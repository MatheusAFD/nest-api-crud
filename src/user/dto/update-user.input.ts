import { InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @IsString()
  @IsNotEmpty({ message: 'Esse campo não pode estar vazio' })
  @IsOptional()
  name?: string;

  @IsEmail({ message: 'Esse campo deve ser um email' })
  @IsNotEmpty({ message: 'Esse campo não pode estar vazio' })
  @IsOptional()
  email?: string;
}
