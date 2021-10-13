import {
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsAlphanumeric('pt-BR', {
    message:
      '$property: O nome de usuário só pode conter caracteres alfanuméricos',
  })
  @Length(4, 16, {
    message: '$property: O nome de usuário precisa ter entre 4 e 16 caracteres',
  })
  username: string;

  @IsOptional()
  @IsEmail({}, { message: '$property: Esse não é um email válido' })
  email: string;

  @IsOptional()
  @MinLength(6, { message: '$property: Precisa ter no mínimo 6 caracteres' })
  password: string;

  @IsOptional()
  @IsString({ message: '$property: Não é uma string válida' })
  role: string;
}
