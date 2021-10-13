import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const crypt = promisify(scrypt);

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAllUsers() {
    return this.userRepo.find();
  }

  async findById(id: number): Promise<User> | null {
    if (!id) return null;
    return this.userRepo.findOne(id);
  }

  async findByUsername(username: string): Promise<User> | null {
    if (!username) return null;
    const [user] = await this.userRepo.find({ username });
    return user;
  }

  async findByEmail(email: string): Promise<User> | null {
    if (!email) return null;
    const [user] = await this.userRepo.find({ email });
    return user;
  }

  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const user = this.userRepo.create({ username, email, password });
    return this.userRepo.save(user);
  }

  async hashPassword(password: string, salt: string) {
    const hash = (await crypt(password, salt, 32)) as Buffer;
    return salt + '.' + hash.toString('hex');
  }

  async updateUser(username: string, currentUser: User, attrs: Partial<User>) {
    const user = await this.findByUsername(username);
    if (!user) throw new NotFoundException('Usuário não existe');
    if (user.id !== currentUser.id && currentUser.role !== 'admin')
      throw new UnauthorizedException('Você não pode fazer isso');
    if (attrs.password) {
      const salt = randomBytes(8).toString('hex');
      attrs.password = await this.hashPassword(attrs.password, salt);
    }
    if (attrs.role) {
      if (currentUser.role !== 'admin') delete attrs.role;
    }
    Object.assign(user, attrs);
    return this.userRepo.save(user);
  }

  async deleteUser(username: string, currentUser: User) {
    const user = await this.findByUsername(username);
    if (!user) throw new NotFoundException('Usuário não existe');
    if (user.id !== currentUser.id && currentUser.role !== 'admin')
      throw new UnauthorizedException('Você não pode fazer isso');
    return this.userRepo.remove(user);
  }
}
