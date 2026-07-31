import {
  downloadFile,
  getBaseToolsConfig,
  authorize,
  enhanceUniApi,
  getPlatformUni,
} from '../index';
import type { UniApiConfig } from '../index';

const cache = {
  isChooseMedia: false,
};

/** 跨端媒体选择结果，H5 额外提供上传所需的 File 对象 */
export type ChooseMediaFile = {
  tempFilePath: string;
  file?: File;
  fileType: 'image' | 'video';
  size?: number;
  duration?: number;
  height?: number;
  width?: number;
  thumbTempFilePath?: string;
};

/**
 * 图片和视频的选择或拍摄
 * - 微信小程序推荐使用chooseMedia, 而chooseImage或chooseVideo已标记过时
 * - H5会根据mediaType自动使用chooseImage或chooseVideo
 * - H5不支持同时选择图片和视频, mediaType为混选或未指定时默认选择图片
 * - H5选择视频时只能选择一个文件, count不生效
 * @param option 选项文档 https://uniapp.dcloud.net.cn/api/media/video.html#choosemedia
 * @returns 跨端媒体文件对象数组 (H5额外包含file字段)
 * @example
 * const tempFiles = await chooseMedia({ count: 3 }); // 选择图片和视频
 * const tempFiles = await chooseMedia({ count: 2, mediaType: ['image'] }); // 选择图片/拍照
 * const tempFiles = await chooseMedia({ count: 1, mediaType: ['video'] }); // 选择视频/录像
 */
export async function chooseMedia(option?: UniApp.ChooseMediaOption): Promise<ChooseMediaFile[]> {
  if (cache.isChooseMedia) {
    const { log } = getBaseToolsConfig();
    const desc = 'Choosing media, please wait..';
    log?.('error', { name: 'chooseMedia', status: 'fail', desc, option });
    throw new Error(desc);
  }

  cache.isChooseMedia = true;
  try {
    const platform = getPlatformUni();
    if (platform === 'web') {
      const config = {
        toastError: (e: { errMsg: string }) => !e.errMsg.includes('cancel'),
      };

      if (option?.mediaType?.length === 1 && option.mediaType[0] === 'video') {
        const { tempFilePath, tempFile, size, duration, height, width } = await chooseVideo(
          {
            sourceType: option.sourceType,
            compressed:
              option.sizeType?.length === 1 ? option.sizeType[0] !== 'original' : undefined,
            maxDuration: option.maxDuration,
            camera: option.camera,
          },
          config,
        );
        return [
          {
            tempFilePath,
            file: tempFile,
            fileType: 'video',
            size,
            duration,
            height,
            width,
          },
        ];
      }

      const { tempFilePaths, tempFiles } = await chooseImage(
        {
          count: option?.count,
          sizeType: option?.sizeType,
          sourceType: option?.sourceType,
        },
        config,
      );
      const paths = Array.isArray(tempFilePaths) ? tempFilePaths : [tempFilePaths];
      const files = Array.isArray(tempFiles) ? tempFiles : [tempFiles];

      return paths.map((tempFilePath, index) => {
        const file = files[index] as File;

        return {
          tempFilePath,
          file,
          fileType: 'image',
          size: file.size,
        };
      });
    }

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
 * - 微信小程序推荐使用chooseMedia, 而chooseImage已标记过时
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
 * - 微信小程序推荐使用chooseMedia, 而chooseVideo已标记过时
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
