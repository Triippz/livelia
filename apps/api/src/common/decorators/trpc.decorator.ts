import { TRPC_ROUTER } from '../constants/trpc.constants';

export const TRPCRouter = (): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(TRPC_ROUTER, true, target)
  }
}
