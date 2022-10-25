import { InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsString()
  @IsNotEmpty({ message: 'Esse campo não pode estar vazio' })
  name: string;

  @IsEmail({ message: 'Esse campo deve ser um email' })
  @IsNotEmpty({ message: 'Esse campo não pode estar vazio' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
