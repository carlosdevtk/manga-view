import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dtos/createAuthor.dto';

@Controller('/api')
export class AuthorController {
  constructor(private authorService: AuthorService) {}

  @Get('/authors')
  async indexAuthors() {
    return this.authorService.findAllAuthors();
  }

  @Post('/author')
  async createAuthor(@Body() dto: CreateAuthorDto) {
    return this.authorService.createAuthor(dto.name);
  }

  @Get('/author/:name')
  async showAuthor(@Param('name') name: string) {
    return this.authorService.findByName(name);
  }
}
