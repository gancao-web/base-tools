/** 请求方法类型 */
export type RequestMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'HEAD'
  | 'OPTIONS'
  | 'TRACE'
  | 'PATCH';

/**
 * 请求参数类型
 * 包含 fetch 原生支持的 BodyInit 类型，以及支持自动 JSON 序列化的对象和数组
 */
export type RequestData =
  | string
  | ArrayBuffer
  | ArrayBufferView
  | Blob
  | FormData
  | URLSearchParams
  | ReadableStream<Uint8Array>
  | Record<string, unknown>
  | unknown[]
  | null;

/**
 * 发起请求的配置 (对外,参数可选)
 */
export type RequestConfig<D extends RequestData = RequestData> = Partial<RequestConfigBase<D>>;

/**
 * 自定义请求的配置 (接口字段参数必填)
 */
export type RequestConfigBase<D extends RequestData = RequestData> = {
  /** 接口地址 */
  url: string;
  /** 请求方法 */
  method?: RequestMethod;
  /** 请求头 */
  header?: Record<string, string>;
  /** 请求参数 */
  data?: D;
  /** 超时时间 (毫秒), 默认 60000 */
  timeout?: number;

  /** 接口返回响应数据的字段, 支持"a[0].b.c"的格式, 当配置false时返回完整的响应数据 */
  resKey: string | false;

  /** 接口返回响应消息的字段, 支持"a[0].b.c"的格式 */
  msgKey: string;

  /** 接口返回响应状态码的字段, 支持"a[0].b.c"的格式 */
  codeKey: string;

  /** 接口返回成功状态码的字段, 支持"a[0].b.c"的格式 (默认取 codeKey) */
  successKey?: string;

  /** 成功状态码 */
  successCode: (number | string)[];

  /** 登录过期状态码 */
  reloginCode: (number | string)[];

  /** 是否显示进度条 (默认true) */
  showLoading?: boolean;

  /** 是否提示接口异常 (默认true) */
  toastError?: boolean;

  /** 是否输出日志 (默认true) */
  isLog?: boolean;

  /** 额外输出的日志数据 */
  extraLog?: Record<string, unknown>;

  /** 响应数据的缓存时间, 单位毫秒。仅在成功时缓存；仅缓存在内存，应用退出,缓存消失。(默认0,不开启缓存) */
  cacheTime?: number;

  /** 是否开启流式传输 (如 SSE) */
  enableChunked?: boolean;

  /** 响应类型 (默认 json, enableChunked为true时忽略) */
  responseType?: 'text' | 'arraybuffer' | 'json';

  /** 响应拦截 */
  responseInterceptor?: (data: unknown) => unknown;
};

/**
 * 请求任务对象 (用于取消请求或监听流式数据)
 */
export interface RequestTask {
  /** 取消请求 */
  abort: () => void;

  /** 监听流式数据块接收事件 */
  onChunkReceived: (callback: ChunkCallback) => void;

  /** 取消监听流式数据块接收事件 */
  offChunkReceived: () => void;
}

/**
 * 流式数据块接收事件回调
 */
export type ChunkCallback = (response: { data: ArrayBuffer }) => void;
