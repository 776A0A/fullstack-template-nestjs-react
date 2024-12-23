interface HttpResponseParams<T = null> {
  code?: number;
  message?: string;
  data?: T;
}

class HttpResponse<T = null> {
  private _code: number = 0;
  private _message: string = '';
  private _data: T = null as T;

  private constructor({
    code = 0,
    message = '',
    data = null as T,
  }: HttpResponseParams<T> = {}) {
    this._code = code;
    this._message = message;
    this._data = data as T;
  }

  public get code(): number {
    return this._code;
  }

  public get message(): string {
    return this._message;
  }

  public get data(): T {
    return this._data;
  }

  public static success<T = null>(data = null as T): HttpResponse<T> {
    return new HttpResponse<T>({
      data,
      code: 0,
      message: 'success',
    });
  }

  public static error(message: string, code: number): HttpResponse {
    return new HttpResponse({ message, code });
  }

  public static of<T = null>(
    params: HttpResponseParams<T> = {},
  ): HttpResponse<T> {
    return new HttpResponse<T>(params);
  }

  toJSON(): object {
    return {
      code: this.code,
      message: this.message,
      data: this.data,
    };
  }
}

export { HttpResponse };
