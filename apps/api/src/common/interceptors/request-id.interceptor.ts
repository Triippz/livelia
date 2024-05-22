import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { REQUEST_ID_TOKEN_HEADER } from '../../modules/auth/constants/header.constants';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();

    // Set request id if not set yet
    const requestId = request.headers[REQUEST_ID_TOKEN_HEADER] as string;
    if (!requestId || !uuidValidateV4(requestId)) {
      request.headers[REQUEST_ID_TOKEN_HEADER] = uuidv4();
    }

    // Set request id in response headers
    response.header(
      REQUEST_ID_TOKEN_HEADER,
      request.headers[REQUEST_ID_TOKEN_HEADER],
    );

    return next.handle().pipe(
      tap(() => {
        // Additional logic if needed after the request is handled
      }),
    );
  }
}

function uuidValidateV4(uuid: string): boolean {
  // validate if v4 uuid and return true or false
  return (
    uuid &&
    uuid.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    ) !== null
  );
}
