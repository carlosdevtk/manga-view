import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest();

    if (!request.currentUser) {
      throw new UnauthorizedException('Faça o login para continuar');
    }

    return true;
  }
}
