import { useUserStore } from '@/store';
import {
  CreateUserRequest,
  SigninRequest,
  SigninResponse,
} from '@oxygen-admin/shared/dto';
import { http } from '../utils';
import { SigninResponseSchema } from './user.schema';

export function signin(data: SigninRequest): Promise<SigninResponse> {
  return http.post({
    url: '/signin',
    data,
    validateResponse: SigninResponseSchema,
    name: 'signin',
  });
}

export function signup(data: CreateUserRequest): Promise<void> {
  return http.post({
    url: '/signup',
    data,
    name: 'signup',
  });
}

export async function signout(): Promise<void> {
  // TODO: 添加后端退出登录接口
  useUserStore.getState().clearUser();
  window.location.href = '/signin';
}
