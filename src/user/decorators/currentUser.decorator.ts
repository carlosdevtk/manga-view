import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.currentUser;
    if (!user) return null;
    return { id: user.id, username: user.username, role: user.role };
  },
);
