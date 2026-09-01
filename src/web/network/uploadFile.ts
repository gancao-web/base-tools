import { enhanceWebApi } from '../async';
import { getBaseToolsConfig } from '../config';
import {
  hasUploadResponseConfig,
  resolveUploadToastError,
  transformUploadResponse,
  UploadBusinessError,
  type UploadResponseConfig,
} from '../../shared/network/upload';
import type { WebApiConfig } from '../async';
import type { ApiTaskConfig } from '../../shared/network/action';

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

export type UploadFail = {
  message: string;
  status: number;
  data?: unknown;
};

/** 上传可能产生的传输错误或业务错误。 */
export type UploadError = UploadFail | UploadBusinessError;

export type UploadConfig = UploadResponseConfig & ApiTaskConfig<UploadTask>;

/** 上传文件的完整增强配置。 */
export type UploadFileConfig<T = string> = UploadConfig & WebApiConfig<T, UploadError>;

export { UploadBusinessError };

function tryParseJson(text: string): { success: true; data: unknown } | { success: false } {
  try {
    return { success: true, data: JSON.parse(text) };
  } catch {
    return { success: false };
  }
}

function getErrorMessage(responseText: string, fallback: string) {
  const parsed = tryParseJson(responseText);
  if (
    parsed.success &&
    parsed.data &&
    typeof parsed.data === 'object' &&
    'message' in parsed.data
  ) {
    const message = (parsed.data as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }
  return fallback;
}

function upload<T = unknown>(option: UploadFileOption, config?: UploadConfig) {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const { url, file, name = 'file', header, data, timeout = 0, responseType = 'text' } = option;

    const fail = (error: UploadFail) => reject(error);

    const success = (responseText: string) => {
      if (responseType === 'json') {
        const parsed = tryParseJson(responseText);
        if (!parsed.success) {
          fail({ message: '响应不是合法 JSON', status: xhr.status });
          return;
        }
        resolve(parsed.data as T);
        return;
      }

      resolve(responseText as T);
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
        const parsed = tryParseJson(responseText);
        // 与 request 一致：非 2xx 的合法 JSON 仍交给业务状态码解析；非 JSON 保持传输错误。
        if (hasUploadResponseConfig(config) && parsed.success) {
          success(responseText);
          return;
        }
        fail({
          message: getErrorMessage(responseText, '上传失败'),
          status: xhr.status,
          data: parsed.success ? parsed.data : null,
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
  config?: UploadFileConfig<T>,
): Promise<T> {
  const uploadApi = async (uploadOption: UploadFileOption, uploadConfig?: UploadConfig) => {
    const res = await upload(uploadOption, uploadConfig);
    return transformUploadResponse<T>(res, config);
  };

  const finalConfig = hasUploadResponseConfig(config)
    ? {
        ...config,
        // 业务错误的提示与 request 保持一致；登录失效只跳转登录，不重复弹错误提示。
        toastError: (error: unknown) =>
          resolveUploadToastError<UploadError>(error, config?.toastError),
      }
    : config;

  return enhanceWebApi<UploadFileOption, T, UploadError, UploadConfig>(uploadApi, 'uploadFile')(
    option,
    finalConfig,
  ).catch((error) => {
    if (error instanceof UploadBusinessError) {
      if (error.relogin) getBaseToolsConfig().toLogin?.();
      return Promise.reject(error.response as T);
    }
    return Promise.reject(error);
  });
}
