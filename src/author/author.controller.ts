import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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

  @Patch('/author/:authorName')
  async updateAuthor(
    @Param('authorName') authorName: string,
    @Body() dto: { name: string },
  ) {
    return this.authorService.updateAuthor(authorName, dto.name);
  }

  @Delete('/author/:name')
  async deleteAuthor(@Param('name') name: string) {
    return this.authorService.deleteAuthor(name);
  }
}
