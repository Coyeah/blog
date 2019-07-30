import {merge} from 'lodash';
// import {notification} from 'antd';

type TBody = 
  | string
  | Blob
  | ArrayBufferView
  | ArrayBuffer
  | FormData
  | URLSearchParams
  | ReadableStream<Uint8Array>
  | IObject
  | null;

interface IFetchCommonOptions {
  header?: Headers | Record<string, string> | string[][];
  mode?: 'cors' | 'no-cors' | 'same-origin';
  credentials?: 'omit' | 'same-origin' | 'include';
  cache?: 
    | 'default'
    | 'no-store'
    | 'reload'
    | 'no-cache'
    | 'force-cache'
    | 'only-if-cached';
  redirect?: 'follow' | 'error' | 'manual';
  referrer?: 'no-referrer' | 'client';
  referrerPolicy?: 
    | ''
    | 'no-referre'
    | 'no-referrer-when-downgrade'
    | 'unsafe-url'
    | 'origin-only';
  integrity?: string;
}

interface IRequestInitOption {
  defaultOptions?: IFetchCommonOptions;
  transformRequest?: TInterceptorPair<TRequestInterceptorOptions>[];
  transformResponse?: TInterceptorPair<TResponseInterceptorOptions>[];
}

interface IFetchOptions extends IFetchCommonOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'DELETE';
  body?: TBody;
}

interface IObject {
  [prop: string]: any;
}

interface IInputOptions extends IFetchOptions {
  params?: IObject;
  query?: IObject;
  transformRequest?: TInterceptorPair<TRequestInterceptorOptions>[]
  transformResponse?: TInterceptorPair<TResponseInterceptorOptions>[];
}

type TRequestInterceptorOptions = IInputOptions & {
  url: string
};

type TResponseInterceptorOptions = 
  | Response
  | Blob
  | FormData
  | ArrayBuffer
  | string
  | never
  | any;

type TIdentity<T> = (arg: T) => T;

type TInterceptorPair<T = any> = {
  onFulfilled: TIdentity<T>;
  onRejected?: TIdentity<any>;
} | null;

// 拦截器类
class InterceptorsManger<T = {}> {
  public interceptors: TInterceptorPair<T>[];

  public constructor(interceptors: TInterceptorPair<T>[] = []) {
    this.interceptors = interceptors;
  }
  // 添加拦截项
  public use(onFulfilled: TIdentity<T>, onRejected?: TIdentity<any>): number {
    const interceptorPair: TInterceptorPair<T> = { onFulfilled };
    if (onRejected) {
      interceptorPair.onRejected = onRejected;
    }
    this.interceptors.push(interceptorPair);
    return this.interceptors.length;
  }
  // 移除拦截项
  public eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null;
    }
  }
  // 装载拦截器
  public compose(
    promise: Promise<T>,
    extraInterceptors: TInterceptorPair<T>[] = []
  ) {
    return extraInterceptors.concat(this.interceptors).reduce((acc, pair) => {
      if (!pair) {
        return acc;
      }
      const { onFulfilled, onRejected } = pair;
      if (onRejected) {
        return acc.then(onFulfilled, onRejected);
      }      
      return acc.then(onFulfilled);
    }, promise);
  }
}

class R {
  public interceptors: {
    request: InterceptorsManger<TRequestInterceptorOptions>;
    response: InterceptorsManger<TResponseInterceptorOptions>;
  };

  public defaultOptions: IFetchCommonOptions;

  constructor(initOptions: IRequestInitOption = {}) {
    const {
      defaultOptions = {},
      transformRequest = [],
      transformResponse = []
    } = initOptions;
    this.interceptors = {
      request: new InterceptorsManger<TRequestInterceptorOptions>(
        transformRequest
      ),
      response: new InterceptorsManger<TResponseInterceptorOptions>(
        transformResponse
      )
    };
    this.defaultOptions = defaultOptions;
  }

  public fetch(url: string, options: IInputOptions) {
    const fullInputOptions = merge({}, this.defaultOptions, options);
    const {
      transformRequest,
      transformResponse,
      ...restOptions
    } = fullInputOptions;
    
    let requestPromise = Promise.resolve({ url, ...restOptions });
    requestPromise = this.interceptors.request.compose(
      requestPromise,
      transformRequest
    );
    let responsePromise = requestPromise.then(
      ({ url, params, query, ...options }) => fetch(url, options as any)
    );
    responsePromise = this.interceptors.response.compose(
      responsePromise,
      transformResponse
    );
    return responsePromise as Promise<any>;
  }

  public get<R = ResponseSchema>(url: string, options: IInputOptions = {}) {
    const result = this.fetch(url, { ...options, method: 'GET' });
    return result as Promise<R>;
  }

  public post<R = ResponseSchema>(url: string, options: IInputOptions = {}) {
    const result = this.fetch(url, { ...options, method: 'POST' });
    return result as Promise<R>;
  }

  public put<R = ResponseSchema>(url: string, options: IInputOptions = {}) {
    const result = this.fetch(url, { ...options, method: 'PUT' });
    return result as Promise<R>;
  }

  public patch<R = ResponseSchema>(url: string, options: IInputOptions = {}) {
    const result = this.fetch(url, { ...options, method: 'PATCH' });
    return result as Promise<R>;
  }

  public head<R = ResponseSchema>(url: string, options: IInputOptions = {}) {
    const result = this.fetch(url, { ...options, method: 'HEAD' });
    return result as Promise<R>;
  }

  public delete<R = ResponseSchema>(url: string, options: IInputOptions = {}) {
    const result = this.fetch(url, { ...options, method: 'DELETE' });
    return result as Promise<R>;
  }
}

// ========== checkResponseStatus ========= //

const errCodeMessages = {
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function isResponseStatusOk(response: Response): boolean {
  const { status } = response;
  return (status >= 200 && status < 300) || status === 304;
}

interface ResponseError extends Error {
  status: number;
  response: Response;
}

function ownThrowError(response: Response): never {
  const errortext = errCodeMessages[response.status] || response.statusText;
  const error = new Error(errortext);
  const myError = error as ResponseError;
  myError.status = response.status;
  myError.response = response;
  console.warn(`"${response.url}"请求错误 ${response.status}：${errortext}`);
  // notification['error']({
  //   message: `请求错误 ${response.status}`,
  //   description:
  //     `${errortext}`,
  // });
  throw myError;
}

function checkResponseStatus(response: Response): Response | never {
  if (isResponseStatusOk(response)) {
    return response;
  }
  return ownThrowError(response);
}


const request = new R();

request.interceptors.response.use(checkResponseStatus);

export default request;

export interface ResponseSchema<T = any> {
  code: number | string;
  errcode: number | string;
  message: string;
  data: T;
  pagination: object | undefined | null;
}
