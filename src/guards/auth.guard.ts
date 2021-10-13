import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/user/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest();
    const jwt = request.cookies['jwt'];

    const result = await this.authService.isValidJwt(jwt);

    if (!result) throw new UnauthorizedException('Faça o login para continuar');

    return true;
  }
}
