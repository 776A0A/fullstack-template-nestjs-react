import {
  CreateUserRequest,
  SigninRequest,
  SigninResponse,
} from '@oxygen-admin/shared/dto';
import * as z from 'zod';

export const CreateUserRequestSchema: z.ZodSchema<
  CreateUserRequest & { confirmPassword: string }
> = z
  .object({
    username: z.string().trim().min(1, { message: '用户名不能少于1个字符' }),
    password: z.string().trim().min(6, { message: '密码最少6个字符' }),
    confirmPassword: z.string().trim().min(1, { message: '请确认密码' }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

export const SigninRequestSchema: z.ZodSchema<SigninRequest> = z.object({
  username: z.string().trim().min(1, { message: '用户名不能为空' }),
  password: z.string().trim().min(1, { message: '密码不能为空' }),
});

export const SigninResponseSchema: z.ZodSchema<SigninResponse> = z.object({
  userId: z.string().trim().min(1, { message: '[响应] 用户ID不能为空' }),
  token: z.string().trim().min(1, { message: '[响应] 令牌不能为空' }),
});
