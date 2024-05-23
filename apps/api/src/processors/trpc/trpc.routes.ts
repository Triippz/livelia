import { UserTrpcRouter } from '../../modules/users/routers/users.router';
import { AuthTrpcRouter } from '../../modules/auth/auth.trpc';


export type tRpcRouters = [
  UserTrpcRouter,
  AuthTrpcRouter
]
