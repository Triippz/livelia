import { ErrorCodeEnum } from '../../common/constants/error-code.constant';

const bizErrorEn: Partial<Record<ErrorCodeEnum, string>> = {
  [ErrorCodeEnum.NoContentCanBeModified]: 'No content can be modified',
  [ErrorCodeEnum.InvalidQuery]: 'Invalid query',
  [ErrorCodeEnum.NotReady]: 'Service is temporarily unavailable, please try again later',
  [ErrorCodeEnum.NotInitialized]: 'Site not initialized, site admin information missing',

  [ErrorCodeEnum.PostNotFound]: 'Post not found',
  [ErrorCodeEnum.PostNotPublished]: 'Post not published',
  [ErrorCodeEnum.PostExist]: 'Post already exists',
  [ErrorCodeEnum.CategoryNotFound]: 'Category not found (｡•́︿•̀｡)',
  [ErrorCodeEnum.CategoryCannotDeleted]: 'Category cannot be deleted as it contains other posts',
  [ErrorCodeEnum.CategoryAlreadyExists]: 'Category already exists',
  [ErrorCodeEnum.SlugExists]: 'Slug already exists',

  [ErrorCodeEnum.AuthFailUserNotExist]: 'Authentication failed, user does not exist',
  [ErrorCodeEnum.AuthFail]: 'Authentication failed, please check username and password',
  [ErrorCodeEnum.JWTExpired]: 'JWT has expired',
  [ErrorCodeEnum.JWTInvalid]: 'JWT is invalid',
  [ErrorCodeEnum.UserNotFound]: 'User not found',
  [ErrorCodeEnum.UserExist]: 'User already exists',
}

export default bizErrorEn
