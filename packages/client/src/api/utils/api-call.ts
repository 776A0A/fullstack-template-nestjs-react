import {
  validateArraySchemaOrThrow,
  validateSchemaOrThrow,
} from '@/common/utils';
import { HttpResult } from '@oxygen-admin/shared/dto';
import { ZodSchema, infer as zInfer } from 'zod';
import { httpCore } from './http-core';

export interface ApiOptionsBase<T> {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  data?: T;
  validateRequest?: ZodSchema<T>;
  name: string;
}

export interface ApiOptionsWithResponse<T, S extends ZodSchema<unknown>>
  extends ApiOptionsBase<T> {
  validateResponse: S;
}

export interface ApiOptionsWithArrayResponse<T, S extends ZodSchema<unknown>>
  extends ApiOptionsBase<T> {
  validateResponse: S;
  isArray: true;
}

export interface ApiOptionsWithoutResponse<T> extends ApiOptionsBase<T> {
  validateResponse?: never;
}

type ApiOptions<T, S extends ZodSchema<unknown>> =
  | ApiOptionsWithResponse<T, S>
  | ApiOptionsWithArrayResponse<T, S>
  | ApiOptionsWithoutResponse<T>;

export async function apiCall<T>(
  options: ApiOptionsWithoutResponse<T>,
): Promise<void>;
export async function apiCall<T, S extends ZodSchema<unknown>>(
  options: Omit<ApiOptionsWithResponse<T, S>, 'isArray'>,
): Promise<zInfer<S>>;
export async function apiCall<T, S extends ZodSchema<unknown>>(
  options: ApiOptionsWithArrayResponse<T, S>,
): Promise<zInfer<S>[]>;
export async function apiCall<T, S extends ZodSchema<unknown>>(
  options: ApiOptions<T, S>,
): Promise<void | zInfer<S> | zInfer<S>[]> {
  const { url, method, data, validateRequest, validateResponse, name } =
    options;
  const isArray = 'isArray' in options && options.isArray;

  if (validateRequest && data) {
    validateSchemaOrThrow.before(data, validateRequest, name);
  }

  const response = await httpCore[method]<HttpResult<unknown>>(url, data);

  if (!validateResponse) return;

  if (isArray) {
    return validateArraySchemaOrThrow.after(
      response.data,
      validateResponse,
      name,
    );
  } else {
    return validateSchemaOrThrow.after(response.data, validateResponse, name);
  }
}
