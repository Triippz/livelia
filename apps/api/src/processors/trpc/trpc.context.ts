// Adjust the createContext function to work with Fastify
import { inferAsyncReturnType } from '@trpc/server';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function createContext({
                                      req,
                                      res,
                                    }: {
  req: FastifyRequest;
  res: FastifyReply;
}) {
  return {
    authorization: req.headers.authorization as string | null,
    lang: req.headers['accept-language'],
    ua: req.headers['user-agent'],
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
