import { z } from 'zod';
import { RolesEnum } from '@livelia/entities';

export const ChangePasswordDto = z.object({
  oldPassword: z.string({
    required_error: 'Old password is required',
  }),
  newPassword: z.string({
    required_error: 'New password is required',
  }),
});
export type ChangePasswordDtoType = z.infer<typeof ChangePasswordDto>;

export const AuthLoginInputDto = z.object({
  username: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type AuthLoginInputDtoType = z.infer<typeof AuthLoginInputDto>;

export const AuthTokenOutputSchema = z.object({
  accessToken: z.string(),
});
export type AuthTokenOutput = z.infer<typeof AuthTokenOutputSchema>;

export const UserAccessTokenClaimsSchema = z.object({
  id: z.number(),
  username: z.string(),
  roles: z.array(z.nativeEnum(RolesEnum)),
});
export type UserAccessTokenClaims = z.infer<typeof UserAccessTokenClaimsSchema>;
