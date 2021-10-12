import { IsAlphanumeric, IsEmail, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsAlphanumeric('pt-BR', {
    message:
      '$property: O nome de usuário só pode conter caracteres alfanuméricos',
  })
  @Length(4, 16, {
    message: '$property: O nome de usuário precisa ter entre 4 e 16 caracteres',
  })
  username: string;

  @IsEmail({}, { message: '$property: Esse não é um email válido' })
  email: string;

  @MinLength(6, { message: '$property: Precisa ter no mínimo 6 caracteres' })
  password: string;
}
