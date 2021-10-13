import { Length, MinLength } from 'class-validator';

export class LoginUserDto {
  @Length(4, 16, {
    message: '$property: O nome de usuário precisa ter entre 4 e 16 caracteres',
  })
  username: string;

  @MinLength(6, { message: '$property: Precisa ter no mínimo 6 caracteres' })
  password: string;
}
