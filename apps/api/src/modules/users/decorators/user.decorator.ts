import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@livelia/entities';
import { getNestExecutionContextRequest } from '../../../common/transformers/get-req.transformer';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);


export const CurrentToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = getNestExecutionContextRequest(ctx);
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;
     // Assuming 'Bearer {token}' format
    return authHeader.split(' ')[1];
  },
);
