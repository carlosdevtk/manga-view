import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async registerUser(username: string, email: string, password: string) {
    username = username.toLowerCase();
    const existingUser = await this.userService.findByUsername(username);

    if (existingUser) {
      throw new BadRequestException('Nome de usuário já está em uso');
    }

    const existingUserByEmail = await this.userService.findByEmail(email);

    if (existingUserByEmail) {
      throw new BadRequestException('Já possui uma conta com esse email');
    }

    const salt = randomBytes(8).toString('hex');
    const hashedPassword = await this.userService.hashPassword(password, salt);

    const user = await this.userService.createUser(
      username,
      email,
      hashedPassword,
    );

    return user;
  }
}
