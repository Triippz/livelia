import { ValidationError } from '@nestjs/common';
import { ValidationException } from '../../../common/exceptions/validation.exception';

export const REQUEST_ID_TOKEN_HEADER = 'x-request-id';

export const FORWARDED_FOR_TOKEN_HEADER = 'x-forwarded-for';

export const REQUEST_USER_AGENT_HEADER = 'User-Agent';

export const REQUEST_GYM_ID_HEADER = 'x-gym-id';

export const ACCEPT_LANGUAGE_HEADER = 'accept-language';

export const VALIDATION_PIPE_OPTIONS = {
  transform: true,
  whitelist: true,
  forbidUnknownValues: true,
  exceptionFactory: (validationErrors: ValidationError[] = []) => {
    return new ValidationException(validationErrors);
  },
};
