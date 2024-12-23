import { infer as zInfer, ZodSchema } from 'zod';
import {
  apiCall,
  ApiOptionsBase,
  ApiOptionsWithArrayResponse,
  ApiOptionsWithoutResponse,
  ApiOptionsWithResponse,
} from './api-call';

type OptionsWithArray<T, S extends ZodSchema<unknown>> = Omit<
  ApiOptionsWithArrayResponse<T, S>,
  'method'
>;
type OptionsWithSingle<T, S extends ZodSchema<unknown>> = Omit<
  ApiOptionsWithResponse<T, S>,
  'method'
>;
type OptionsWithoutResponse<T> = Omit<ApiOptionsWithoutResponse<T>, 'method'>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createHttpMethod(method: string) {
  function httpMethod<T, S extends ZodSchema<unknown>>(
    options: OptionsWithArray<T, S>,
  ): Promise<zInfer<S>[]>;
  function httpMethod<T, S extends ZodSchema<unknown>>(
    options: OptionsWithSingle<T, S>,
  ): Promise<zInfer<S>>;
  function httpMethod<T>(options: OptionsWithoutResponse<T>): Promise<void>;
  function httpMethod<T, S extends ZodSchema<unknown>>(
    options: Omit<ApiOptionsBase<T>, 'method'> & {
      validateResponse?: S;
      isArray?: boolean;
    },
  ): Promise<void | zInfer<S> | zInfer<S>[]> {
    return apiCall({
      ...options,
      method,
    } as ApiOptionsWithResponse<T, S>);
  }
  return httpMethod;
}

export const http = {
  get: createHttpMethod('get'),
  post: createHttpMethod('post'),
  put: createHttpMethod('put'),
  delete: createHttpMethod('delete'),
  patch: createHttpMethod('patch'),
};
