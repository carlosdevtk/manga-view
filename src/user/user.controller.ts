import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { request, Request, Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { GuestGuard } from 'src/guards/guest.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/currentUser.decorator';
import { CreateUserDto } from './dtos/createUser.dto';
import { LoginUserDto } from './dtos/loginUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('/api')
@Serialize(UserDto)
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Get('/users')
  @UseGuards(AuthGuard)
  indexUsers() {
    return this.userService.findAllUsers();
  }

  @Post('/auth/register')
  @UseGuards(GuestGuard)
  registerUser(@Body() user: CreateUserDto) {
    return this.authService.registerUser(
      user.username,
      user.email,
      user.password,
    );
  }

  @Post('/auth/login')
  @UseGuards(GuestGuard)
  @HttpCode(200)
  async loginUser(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.loginUser(dto.username, dto.password);

    const token = await this.jwtService.signAsync(user.username);

    response.cookie('jwt', token, { httpOnly: true });
  }

  @Post('/auth/logout')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async logoutUser(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    request.currentUser = null;
    response.clearCookie('jwt');
  }

  @Get('/user/:username')
  @UseGuards(AuthGuard)
  showUser(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @Get('/auth/user')
  async currentUser(@CurrentUser() user: User) {
    return user;
  }

  @Patch('/user/:username')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('username') username: string,
    @CurrentUser() user: User,
    @Body() attrs: UpdateUserDto,
  ) {
    return this.userService.updateUser(username, user, attrs);
  }

  @Delete('/user/:username')
  @UseGuards(AuthGuard)
  async deleteUser(
    @Param('username') username: string,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.clearCookie('jwt');

    return this.userService.deleteUser(username, user);
  }
}
