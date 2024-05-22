
import en from './en';
import { ErrorCodeEnum } from '../../common/constants/error-code.constant';

const langMap = { en, 'en-US': en }

export function errorMessageFor(
  code: ErrorCodeEnum,
  language: keyof typeof langMap,
): string
export function errorMessageFor(
  code: ErrorCodeEnum,
  language: string,
): string | undefined
export function errorMessageFor(
  code: ErrorCodeEnum,
  language: keyof typeof langMap,
): string | undefined {
  return langMap[language]?.[code]
}
