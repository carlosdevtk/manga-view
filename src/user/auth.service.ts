import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async isValidJwt(jwt: string) {
    if (!jwt) return false;
    const data = await this.jwtService.verifyAsync(jwt);
    if (!data) return false;
    return true;
  }

  async getCurrentUser(jwt: string) {
    if (!this.isValidJwt(jwt))
      throw new UnauthorizedException('Faça o login para continuar');

    const data = await this.jwtService.verifyAsync(jwt);
    return this.userService.findByUsername(data);
  }

  async loginUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new BadRequestException('Credenciais inválidas');
    }

    const [salt, hashedPassword] = user.password.split('.');
    const hash = await this.userService.hashPassword(password, salt);

    if (salt + '.' + hashedPassword !== hash) {
      throw new BadRequestException('Credenciais inválidas');
    }

    return user;
  }

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
