export interface HttpResult<T = unknown> {
  data: T;
  code: number;
  message: string;
}
