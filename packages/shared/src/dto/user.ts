export interface CreateUserRequest {
  username: string;
  password: string;
}

export interface UpdateUserRequest {
  password: string;
}

export interface UserResponse {
  id: string;
  username: string;
}
