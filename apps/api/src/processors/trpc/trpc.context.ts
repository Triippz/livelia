import { inferAsyncReturnType } from '@trpc/server';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getIp } from '../../utils/ip.util';

export async function createContext({
                                      req,
                                      res,
                                    }: {
  req: FastifyRequest;
  res: FastifyReply;
}) {
  const ip = getIp(req);
  const agent = req.headers['user-agent'];
  const authHeader = req.headers.authorization;
  const authToken = authHeader ? authHeader.split(' ')[1] : null;

  return {
    authorization: req.headers.authorization as string | null,
    lang: req.headers['accept-language'],
    ua: agent,
    authToken,
    ipLocation: {
      ip,
      agent,
    },
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
