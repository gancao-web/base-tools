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

  /** 额外的formData参数 */
  formData?: Record<string, string | number>;

  /** 超时时间，单位 ms，默认 0（不超时） */
  timeout?: number;
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

export type ApiConfig = {
  /** 获取task对象 */
  onTaskReady?: (task: UploadTask) => void;
};

export type UploadFail = {
  message: string;
  status: number;
};

/**
 * 上传文件
 * @param option 上传文件的选项
 * @param config 配置项
 * @example
 * // 上传
 * await uploadFile({ url: 'https://xx', file: file});
 *
 * // 监听上传进度
 * await uploadFile({ url: 'https://xx', file: file}, {
 *   onTaskReady: (task) =>
 *     task.onProgressUpdate((res) => console.log('上传进度:', res.progress)),
 * });
 */
export function uploadFile<T>(option: UploadFileOption, config?: ApiConfig) {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const { url, file, name = 'file', header, formData, timeout = 0 } = option;

    const fail = (error: UploadFail) => reject(error);

    const success = (responseText: string) => {
      try {
        resolve(JSON.parse(responseText) as T);
      } catch (e) {
        resolve(responseText as T);
      }
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
      if (xhr.status >= 200 && xhr.status < 300) {
        success(xhr.responseText);
      } else {
        fail({ message: `上传失败`, status: xhr.status });
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
    const data = new FormData();
    data.append(name, file);
    if (formData) {
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== undefined) data.append(k, String(v));
      });
    }

    // 发送请求
    xhr.send(data);
  });
}
