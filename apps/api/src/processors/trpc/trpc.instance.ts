import { z } from 'zod'

import { inferRouterInputs, inferRouterOutputs, initTRPC } from '@trpc/server'

import { Context } from './trpc.context'
import { tRPCService } from './trpc.service'
import { BizException } from '../../common/exceptions/biz.exception';
import { ErrorCodeEnum } from '../../common/constants/error-code.constant';
import { errorMessageFor } from '../../i18n/biz-code';

export const tRpc = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error, ctx } = opts
    let bizMessage = ''
    let bizCode = undefined as ErrorCodeEnum | undefined

    if (error.cause instanceof BizException) {
      const acceptLanguage = ctx?.lang
      const languages = acceptLanguage.split(',')
      const preferredLanguage = languages[0]?.split(';')?.[0]
      const BizError = error.cause

      bizMessage =
        errorMessageFor(BizError.bizCode, preferredLanguage) || BizError.message
      bizCode = BizError.bizCode
    }

    if (error.cause instanceof z.ZodError) {
      bizMessage = Array.from(
        Object.keys(error.cause.flatten().fieldErrors),
      )[0][0]
    }

    return {
      ...shape,
      message: bizMessage || shape.message,
      bizCode,
      data: {
        ...shape.data,
      },
    }
  },
})
export type tRpcRouterType = (typeof tRpc)['router']
export type tRpcProcedure = (typeof tRpc)['procedure']
export type tRpc$Config = typeof tRpc._config

export type AppRouter = tRPCService['appRouter']
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
