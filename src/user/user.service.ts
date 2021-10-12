import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { scrypt } from 'crypto';
import { promisify } from 'util';

const crypt = promisify(scrypt);

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

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
}
