import { useUserStore } from '@/store';
import { HttpResult } from '@oxygen-admin/shared/dto';
import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { toast } from 'sonner';

const axiosInstance = axios.create({ baseURL: '/api/v1' });

axiosInstance.interceptors.request.use(addAuthorization);
axiosInstance.interceptors.response.use(null, handleError);

const createMethod = (method: string) => {
  return async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<HttpResult<T>> => {
    const response = await axiosInstance<HttpResult<T>>({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  };
};

export const httpCore = {
  get: createMethod('get'),
  post: createMethod('post'),
  put: createMethod('put'),
  delete: createMethod('delete'),
  patch: createMethod('patch'),
};

function addAuthorization(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const token = useUserStore.getState().token;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

function handleError(error: AxiosError<HttpResult<null>>): Promise<never> {
  const requestId = error.response?.headers?.['x-request-id'];
  const httpStatus = error.response?.status;
  const { code, message = '未知错误，请联系管理员' } =
    error.response?.data || {};

  console.error(
    `请求错误
    requestId: ${requestId}
    code: ${code}
    message: ${message}\n`,
    error,
  );

  if (httpStatus !== 200 && httpStatus !== 201) {
    toast.error(message);
  }

  if (httpStatus === 401) {
    useUserStore.getState().clearUser();
    window.location.href = '/signin';
  }

  return Promise.reject(error);
}
