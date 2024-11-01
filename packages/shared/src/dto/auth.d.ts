interface AuthCredentialRequestDto {
  username: string;
  password: string;
}

export interface LoginCredentialRequestDto extends AuthCredentialRequestDto {}

export interface RegisterCredentialRequestDto
  extends AuthCredentialRequestDto {}

export interface LoginResponseDto {
  token: string;
}
