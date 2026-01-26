import { downloadFile, getBaseToolsConfig, authorize, enhanceUniApi } from '../index';
import type { UniApiConfig } from '../index';

const cache = {
  isChooseMedia: false,
};

/**
 * 图片和视频的选择或拍摄
 * - 不支持H5 (如需在H5上使用, 请使用chooseImage或chooseVideo)
 * @param option 选项文档 https://uniapp.dcloud.net.cn/api/media/video.html#choosemedia
 * @returns 路径数组 (不是File对象)
 * @example
 * const tempFiles = await chooseMedia({ count: 3 }); // 选择图片和视频
 * const tempFiles = await chooseMedia({ count: 2, mediaType: ['image'] }); // 选择图片/拍照
 * const tempFiles = await chooseMedia({ count: 1, mediaType: ['video'] }); // 选择视频/录像
 */
export async function chooseMedia(option?: UniApp.ChooseMediaOption) {
  if (cache.isChooseMedia) {
    const { log } = getBaseToolsConfig();
    const desc = 'Choosing media, please wait..';
    log?.('error', { name: 'chooseMedia', status: 'fail', desc, option });
    throw new Error(desc);
  }

  cache.isChooseMedia = true;
  try {
    const { tempFiles } = await enhanceUniApi(uni.chooseMedia, 'chooseMedia')(option, {
      toastError: (e) => !e.errMsg.includes('cancel'),
    });
    return tempFiles;
  } finally {
    cache.isChooseMedia = false;
  }
}

/**
 * 图片的选择或拍摄
 * - 支持h5 (小程序上传取tempFilePaths, 而H5取tempFiles)
 * @param option 选项文档 https://uniapp.dcloud.net.cn/api/media/image.html
 * @returns 图片路径和File对象数组 {tempFilePaths, tempFiles}
 * @example
 * const { tempFilePaths, tempFiles } = await chooseImage({ count: 9 });
 */
export function chooseImage(option?: UniApp.ChooseImageOptions, config?: UniApiConfig) {
  return enhanceUniApi(uni.chooseImage, 'chooseImage')(option, config);
}

/**
 * 视频的选择或拍摄
 * - 支持h5 (小程序上传取tempFilePaths, 而H5取tempFiles)
 * @param option 选项文档 https://uniapp.dcloud.net.cn/api/media/video.html
 * @returns 视频路径和File对象 {tempFilePath, tempFile}
 * @example
 * const { tempFilePath, tempFile } = await chooseVideo();
 */
export function chooseVideo(option?: UniApp.ChooseVideoOptions, config?: UniApiConfig) {
  return enhanceUniApi(uni.chooseVideo, 'chooseVideo')(option, config);
}

/**
 * 保存图片到相册
 * @param filePath 图片路径, 可以是网络路径或本地路径
 * @example
 * await saveImageToPhotosAlbum('xx');
 */
export async function saveImageToPhotosAlbum(filePath: string, config?: UniApiConfig) {
  await authorize('scope.writePhotosAlbum', "请开启'添加到相册'的权限");

  if (filePath.startsWith('http')) {
    filePath = await downloadFile(
      { url: filePath },
      { showLoading: true, ...config, toastSuccess: false },
    );
  }

  await enhanceUniApi(uni.saveImageToPhotosAlbum, 'saveImageToPhotosAlbum')(
    { filePath },
    { toastSuccess: '保存成功', showLoading: true, ...config },
  );
}
