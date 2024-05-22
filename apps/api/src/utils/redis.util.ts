import { RedisKeys } from '../common/constants/cache.constant';

export const getRedisKey = <T extends string = RedisKeys | '*'>(
  key: T,
  ...concatKeys: string[]
): `${'livelia'}:${T}${string | ''}` => {
  return `${'livelia'}:${key}${
    concatKeys && concatKeys.length ? `:${concatKeys.join('_')}` : ''
  }`
}
