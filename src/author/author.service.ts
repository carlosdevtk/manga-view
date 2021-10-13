import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author) private authorRepo: Repository<Author>,
  ) {}

  async findAllAuthors() {
    return this.authorRepo.find();
  }

  async createAuthor(name: string) {
    const displayName = name;
    name = name.replace(/ /g, '-').toLowerCase();

    const existingAuthor = await this.findByName(name);

    if (existingAuthor)
      throw new BadRequestException('Esse author já está cadastrado');

    const author = this.authorRepo.create({ name, displayName });

    return this.authorRepo.save(author);
  }

  async findById(id: number) {
    if (!id) return null;
    return this.authorRepo.findOne(id);
  }

  async findByName(name: string) {
    if (!name) return null;
    const [author] = await this.authorRepo.find({ name });

    return author;
  }
}
