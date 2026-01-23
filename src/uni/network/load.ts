import { getBaseToolsConfig, getFileUrl, enhanceUniApi } from '../index';
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
 * const tempFilePath = await downloadFile({ url: 'xx' });
 * const tempFilePath = await downloadFile({ url: 'xx' }, {showLoading = '下载中...', toastSuccess = '下载成功', toastError = '下载失败'});
 * const tempFilePath = await downloadFile({ url: 'xx' }, {onTaskReady}); // 获取task对象,用于监听下载进度
 */
export async function downloadFile(
  option: UniApp.DownloadFileOption & { cacheFile?: boolean },
  config?: UniApiConfig<
    UniApp.DownloadSuccessData,
    UniApp.GeneralCallbackResult,
    UniApp.DownloadTask
  >,
) {
  const { cacheFile = true, url } = option;
  const fillUrl = getFileUrl(url);
  const fillOption = { ...option, url: fillUrl };

  if (cacheFile && cache.downloadFiles[url]) {
    const res = cache.downloadFiles[url];
    const { log } = getBaseToolsConfig();
    log?.('info', { name: 'downloadFile', status: 'success', option, res, fromCache: true });
    return res;
  }

  const { tempFilePath } = await enhanceUniApi<
    UniApp.DownloadFileOption,
    UniApp.DownloadSuccessData,
    UniApp.GeneralCallbackResult,
    UniApp.DownloadTask
  >(uni.downloadFile, 'downloadFile')(fillOption, config);

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
export function loadFontFace(
  option: Omit<UniApp.LoadFontFaceOptions, 'source'> & { url: string },
  config?: UniApiConfig,
) {
  return enhanceUniApi(uni.loadFontFace, 'loadFontFace')(
    { global: true, source: `url(${option.url})`, ...option },
    config,
  );
}

/**
 * 上传文件
 * @param option 选项文档: https://uniapp.dcloud.net.cn/api/request/network-file.html
 * @example
 * // 上传
 * await uploadFile({ url: 'https://xx', filePath: 'xx'});
 *
 * // 监听上传进度
 * await uploadFile({ url: 'https://xx', filePath: 'xx'}, {
 *   onTaskReady: (task) =>
 *     task.onProgressUpdate((res) => {
 *       console.log('progress', res);
 *     }),
 * });
 */
export function uploadFile(
  option: UniApp.UploadFileOption,
  config?: UniApiConfig<
    UniApp.UploadFileSuccessCallbackResult,
    UniApp.GeneralCallbackResult,
    UniApp.UploadTask
  >,
) {
  return enhanceUniApi<
    UniApp.UploadFileOption,
    UniApp.UploadFileSuccessCallbackResult,
    UniApp.GeneralCallbackResult,
    UniApp.UploadTask
  >(uni.uploadFile, 'uploadFile')(option, config);
}
