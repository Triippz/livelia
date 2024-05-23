import { z } from "zod";

export const CreateUserDto = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string(),
  lastName: z.string(),
});
export type CreateUserDtoType = z.infer<typeof CreateUserDto>;

export const UpdateUserDtoZ = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});
export type UpdateUserDtoType = z.infer<typeof UpdateUserDtoZ>;

export const CheckUsernameDto = z.object({
  username: z.string(),
});
export type CheckUsernameDtoType = z.infer<typeof CheckUsernameDto>;

export const FindUserByIdDto = z.object({
  id: z.string(),
});
export type FindUserByIdDtoType = z.infer<typeof FindUserByIdDto>;
