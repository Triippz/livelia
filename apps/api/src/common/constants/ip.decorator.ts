import { FastifyRequest } from 'fastify'

import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { getIp } from '../../utils/ip.util';

export type IpRecord = {
  ip: string
  agent: string
}
export const IpLocation = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>()
    const ip = getIp(request)
    const agent = request.headers['user-agent']
    return {
      ip,
      agent,
    }
  },
)
