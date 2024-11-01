import {
  LoginCredentialRequestDto,
  LoginResponseDto,
  RegisterCredentialRequestDto,
} from '@lr/shared/dto';
import { http, token } from './utils';

export async function login(params: LoginCredentialRequestDto) {
  const data = await http.post<LoginResponseDto>('/auth/login', params);
  token.set(data.token);
}

export async function register(params: RegisterCredentialRequestDto) {
  return http.post('/auth/register', params);
}

export async function logout() {
  token.remove();
}
