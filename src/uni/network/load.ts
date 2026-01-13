import { getFileUrl, promisifyUniApi } from '../index';
import type { UniApiConfig } from '../index';

const cache = {
  downloadFiles: {} as Record<string, string>,
};

/**
 * 下载文件
 * @param path 完整/相对文件地址
 * @param option 选项文档: http://uniapp.dcloud.io/api/request/network-file?id=downloadfile
 * @param option.cacheFile 多次下载相同地址,是否优先取已下载的缓存文件, 默认值为 true (程序退出,缓存消失)
 * @example
 * const tempFilePath = await downloadFile('xx');
 * const tempFilePath = await downloadFile('xx', {showLoading = '下载中...', toastSuccess = '下载成功', toastError = '下载失败'});
 */
export async function downloadFile(path: string, option?: { cacheFile?: boolean } & UniApiConfig) {
  const { cacheFile = true } = option || {};
  const url = getFileUrl(path);

  if (cacheFile && cache.downloadFiles[url]) {
    return cache.downloadFiles[url];
  }

  const { tempFilePath } = await promisifyUniApi<
    UniApp.DownloadFileOption,
    UniApp.DownloadSuccessData,
    UniApp.GeneralCallbackResult,
    UniApp.DownloadTask
  >(uni.downloadFile)({ url }, option);

  if (cacheFile) cache.downloadFiles[url] = tempFilePath;

  return tempFilePath;
}

/**
 * 加载字体
 * @param option.family 字体名称
 * @param option.url 字体文件地址
 * @example
 * await loadFontFace({ family: 'xx', url: 'https://xx.ttf'});
 */
export function loadFontFace(option: Omit<UniApp.LoadFontFaceOptions, 'source'> & { url: string }) {
  return promisifyUniApi(uni.loadFontFace)({
    global: true,
    source: `url(${option.url})`,
    ...option,
  });
}

/**
 * 上传文件
 * @param option https://uniapp.dcloud.net.cn/api/request/network-file.html
 * @example
 * const promise = uploadFile({ url: 'https://xx', filePath: 'xx'});
 * promise.task.onProgressUpdate((res) => {
 *   console.log('progress', res);
 * });
 * await promise;
 */
export function uploadFile(option: UniApp.UploadFileOption) {
  return promisifyUniApi<
    UniApp.UploadFileOption,
    UniApp.UploadFileSuccessCallbackResult,
    UniApp.GeneralCallbackResult,
    UniApp.UploadTask
  >(uni.uploadFile)(option);
}
