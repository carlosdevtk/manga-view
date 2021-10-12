import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';

@Controller('/api')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('/auth/register')
  registerUser(@Body() user: CreateUserDto) {
    return this.authService.registerUser(
      user.username,
      user.email,
      user.password,
    );
  }

  @Get('/user/:username')
  showUser(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }
}
