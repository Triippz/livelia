export enum ErrorCodeEnum {
  Default = 1,
  Custom = 2,

  NoContentCanBeModified = 1000,
  InvalidQuery = 1001,
  ResourceNotFound = 1002,
  EmailTemplateNotFound = 1003,
  EmailSendError = 1004,

  NotReady = 5000,
  NotInitialized = 5001,

  PostNotFound = 10000,
  PostExist = 10001,
  CategoryNotFound = 10002,
  CategoryCannotDeleted = 10003,
  CategoryAlreadyExists = 10004,
  PostNotPublished = 10005,
  SlugExists = 10006,

  NoteNotFound = 10007,
  NoteExist = 10008,
  NoteNotPublished = 10009,
  NoteTopicNotFound = 10010,

  PageNotFound = 12011,
  PageCountExceed = 12012,

  AuthFailUserNotExist = 20000,
  AuthFail = 20001,
  JWTExpired = 20002,
  JWTInvalid = 20003,
  InsufficientPermissions = 20004,
  NotAuthorized = 20005,
  InvalidCredentials = 20006,

  UserNotFound = 30000,
  UserExist = 30001,

  CommentBanned = 40000,
  CommentConflict = 40001,
  CommentNotFound = 40002,
}

export const ErrorCode = Object.freeze<Record<ErrorCodeEnum, [string, number]>>(
  {
    [ErrorCodeEnum.Default]: ['Unknown error', 500],
    [ErrorCodeEnum.Custom]: ['', 500],

    [ErrorCodeEnum.NoContentCanBeModified]: ['no content can be modified', 400],
    [ErrorCodeEnum.InvalidQuery]: ['invalid query', 400],
    [ErrorCodeEnum.NotReady]: ['not ready, please try again later', 503],
    [ErrorCodeEnum.NotInitialized]: [
      'not initialized, site owner is missing',
      503,
    ],
    [ErrorCodeEnum.ResourceNotFound]: ['resource not found', 404],
    [ErrorCodeEnum.EmailTemplateNotFound]: ['email template not found', 500],
    [ErrorCodeEnum.EmailSendError]: ['email send error', 500],

    /// Post
    [ErrorCodeEnum.PostNotFound]: ['post not found', 404],
    [ErrorCodeEnum.PostNotPublished]: ['post not found', 404],
    [ErrorCodeEnum.PostExist]: ['post already exist', 400],
    [ErrorCodeEnum.CategoryNotFound]: ['category not found', 404],
    [ErrorCodeEnum.CategoryCannotDeleted]: [
      'there are other posts in this category, cannot be deleted',
      400,
    ],
    [ErrorCodeEnum.CategoryAlreadyExists]: ['category already exists', 400],
    [ErrorCodeEnum.SlugExists]: ['slug already exists', 400],
    [ErrorCodeEnum.NoteNotFound]: ['note not found', 404],
    [ErrorCodeEnum.NoteNotPublished]: ['note not found', 404],
    [ErrorCodeEnum.NoteExist]: ['note already exist', 400],
    [ErrorCodeEnum.NoteTopicNotFound]: ['note topic not found', 404],
    [ErrorCodeEnum.PageNotFound]: [
      'page not found, please check your url',
      404,
    ],
    [ErrorCodeEnum.PageCountExceed]: ['page count exceed', 400],

    [ErrorCodeEnum.AuthFailUserNotExist]: ['auth failed, user not exist', 400],
    [ErrorCodeEnum.AuthFail]: [
      'auth failed, please check your username and password',
      400,
    ],
    [ErrorCodeEnum.JWTExpired]: ['jwt expired', 401],
    [ErrorCodeEnum.JWTInvalid]: ['jwt invalid', 401],
    [ErrorCodeEnum.UserNotFound]: ['user not found', 404],
    [ErrorCodeEnum.UserExist]: ['user already exist', 400],
    [ErrorCodeEnum.InsufficientPermissions]: ['insufficient permissions', 403],
    [ErrorCodeEnum.NotAuthorized]: ['not authorized', 403],
    [ErrorCodeEnum.InvalidCredentials]: ['invalid credentials', 400],

    [ErrorCodeEnum.CommentBanned]: ['this article comment is not allowed', 403],
    [ErrorCodeEnum.CommentConflict]: [
      "Your comment information or email conflicts with the site owner's information",
      403,
    ],
    [ErrorCodeEnum.CommentNotFound]: ['comment not found', 404],
  },
)
