import { enhanceWebApi } from '../async';
import type { WebApiConfig } from '../async';

/**
 * 上传所需的额外参数。
 * null 和 undefined 会被忽略，其余值会通过 String(value) 写入 FormData；
 * 对象和数组不会自动 JSON 序列化，调用方应按接口协议提前处理。
 */
export type UploadData = Record<string, unknown>;

/**
 * 上传文件的选项
 */
export type UploadFileOption = {
  /** 上传接口地址 */
  url: string;

  /** 要上传的文件对象 */
  file: File;

  /** 文件对应的 key, 默认'file' (服务端通过这个 key 获取文件的二进制内容) */
  name?: string;

  /** 请求头 */
  header?: Record<string, string | number>;

  /** 请求参数 */
  data?: UploadData;

  /** 超时时间，单位 ms，默认 0（不超时） */
  timeout?: number;

  /** 响应类型, 默认'text' */
  responseType?: 'text' | 'json';
};

export type OnUploadProgressUpdate = (res: UploadProgressEvent) => void;

export type UploadProgressEvent = {
  /** 上传进度百分比: 0-100 */
  progress: number;
  /** 已上传字节数 */
  loaded: number;
  /** 总字节数 */
  total: number;
};

export type UploadTask = {
  /** 上传进度 */
  onProgressUpdate: (callback: OnUploadProgressUpdate) => void;
  /** 取消上传 */
  abort: () => void;
};

export type UploadConfig = {
  /** 获取task对象 */
  onTaskReady?: (task: UploadTask) => void;
};

export type UploadFail = {
  message: string;
  status: number;
  data?: unknown;
};

function parseJsonSafe(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function getErrorMessage(responseText: string, fallback: string) {
  const parsed = parseJsonSafe(responseText);
  if (parsed && typeof parsed === 'object' && 'message' in parsed) {
    const message = (parsed as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }
  return fallback;
}

function upload<T = unknown>(option: UploadFileOption, config?: UploadConfig) {
  return new Promise<string | T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const { url, file, name = 'file', header, data, timeout = 0, responseType = 'text' } = option;

    const fail = (error: UploadFail) => reject(error);

    const success = (responseText: string) => {
      if (responseType === 'json') {
        const parsed = parseJsonSafe(responseText);
        if (parsed === null) {
          fail({ message: '响应不是合法 JSON', status: xhr.status });
          return;
        }
        resolve(parsed as T);
        return;
      }

      resolve(responseText);
    };

    // 构造任务对象
    let onProgressUpdate: OnUploadProgressUpdate;
    const task: UploadTask = {
      onProgressUpdate: (callback) => {
        onProgressUpdate = callback;
      },
      abort: () => xhr.abort(),
    };
    config?.onTaskReady?.(task);

    // 监听进度
    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      const ev: UploadProgressEvent = {
        progress: Math.round((e.loaded / e.total) * 100),
        loaded: e.loaded,
        total: e.total,
      };
      onProgressUpdate?.(ev);
    };

    // 监听事件
    xhr.onload = () => {
      const responseText = xhr.responseText || '';
      if (xhr.status >= 200 && xhr.status < 300) {
        success(responseText);
      } else {
        fail({
          message: getErrorMessage(responseText, '上传失败'),
          status: xhr.status,
          data: parseJsonSafe(responseText),
        });
      }
    };
    xhr.onerror = () => fail({ message: '网络错误', status: 0 });
    xhr.ontimeout = () => fail({ message: '上传超时', status: -1 });
    xhr.onabort = () => fail({ message: '用户取消', status: -2 });

    // 设置请求方法和 URL
    xhr.open('POST', url);

    // 设置请求头
    if (header) {
      Object.entries(header).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') xhr.setRequestHeader(k, String(v));
      });
    }

    // 设置超时时间
    xhr.timeout = timeout;

    // 组装 FormData
    const formData = new FormData();
    if (data) {
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, String(v));
      });
    }

    // OSS直传的file字段必须写在最后
    formData.append(name, file);

    // 发送请求
    xhr.send(formData);
  });
}

/**
 * 上传文件
 * @param option 上传文件的选项
 * @param config 配置项
 * @example
 * // 上传
 * const res = await uploadFile({ url: 'https://xx', file: file});
 *
 * // 监听上传进度
 * const res = await uploadFile({ url: 'https://xx', file: file}, {
 *   onTaskReady: (task) =>
 *     task.onProgressUpdate((res) => console.log('上传进度:', res.progress)),
 * });
 *
 * // 直接返回json对象
 * const json = await uploadFile({ url: 'https://xx', file: file, responseType: 'json' });
 *
 * // 解析上传结果
 * console.log('uploadFile ok', JSON.parse(res));
 */
export function uploadFile<T = string>(
  option: UploadFileOption,
  config?: UploadConfig & WebApiConfig<T, UploadFail>,
): Promise<T> {
  return enhanceWebApi(
    upload as (option: UploadFileOption, config?: UploadConfig) => Promise<T>,
    'uploadFile',
  )(option, config);
}
