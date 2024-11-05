interface HttpResponseParams<T = null> {
  code?: number;
  message?: string;
  data?: T;
}

class HttpResponse<T = null> {
  #code: number = 0;
  #message: string = '';
  #data: T = null as T;

  private constructor({
    code = 0,
    message = '',
    data = null as T,
  }: HttpResponseParams<T> = {}) {
    this.#code = code;
    this.#message = message;
    this.#data = data as T;
  }

  public get code(): number {
    return this.#code;
  }
  public get message(): string {
    return this.#message;
  }

  public get data(): T {
    return this.#data;
  }

  public static success<T = null>(data = null as T) {
    return new HttpResponse<T>({ data });
  }

  public static error(message: string, code: number) {
    return new HttpResponse({ message, code });
  }

  public static of<T = null>(params: HttpResponseParams<T> = {}) {
    return new HttpResponse<T>(params);
  }

  toJSON() {
    return { code: this.code, message: this.message, data: this.data };
  }
}

export { HttpResponse };
