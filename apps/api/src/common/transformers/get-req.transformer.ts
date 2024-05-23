import { FastifyRequest } from 'fastify'

import { ExecutionContext } from '@nestjs/common'
import { UserAccessTokenClaims } from '@livelia/dtos';

export function getNestExecutionContextRequest(
  context: ExecutionContext,
): FastifyRequest & { claims?: UserAccessTokenClaims; token?: string } & Record<string, any> {
  return context.switchToHttp().getRequest<FastifyRequest>()
}
