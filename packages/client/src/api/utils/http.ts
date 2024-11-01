import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { token } from './token';

const API_URL =
  process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:9823/api';

const axiosInstance = axios.create({ baseURL: API_URL });

axiosInstance.interceptors.request.use(addAuthorization);

const createMethod = (method: string) => {
  return async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance({
        method,
        url,
        data,
        ...config,
      });
      return response.data;
    } catch (error) {
      console.error('请求错误:', error);
      if (error.response.status === 401) {
        token.remove();
        window.location.href = '/login';
      }
      throw error;
    }
  };
};

export const http = {
  get: createMethod('get'),
  post: createMethod('post'),
  put: createMethod('put'),
  delete: createMethod('delete'),
  patch: createMethod('patch'),
};

function addAuthorization(config: any) {
  const tokenStr = token.get();

  if (tokenStr) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${tokenStr}`;
  }

  return config;
}
