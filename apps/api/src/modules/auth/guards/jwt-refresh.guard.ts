import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

import { Reflector } from "@nestjs/core";
import { STRATEGY_JWT_REFRESH } from '../../../common/constants/strategy.constant';
import { PUBLIC_ENDPOINT } from '../../../common/constants/auth.constants';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(STRATEGY_JWT_REFRESH) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    const decoratorSkip =
      this.reflector.get(
        PUBLIC_ENDPOINT,
        context.getClass()
      ) ||
      this.reflector.get(
        PUBLIC_ENDPOINT,
        context.getHandler()
      );
    if (decoratorSkip) return true;
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException(`${info}`);
    }
    return user;
  }
}
