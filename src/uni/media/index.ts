import { downloadFile, getAppConfig, authorize, promisifyUniApi } from '../index';
import type { UniApiConfig } from '../index';

const cache = {
  isChooseMedia: false,
};

/**
 * 选择图片和视频
 * @param option 选项文档 https://uniapp.dcloud.net.cn/api/media/video.html
 * @example
 * const tempFiles = await chooseMedia({ count: 3 }); // 选择图片和视频
 * const tempFiles = await chooseMedia({ count: 2, mediaType: 'image' }); // 选择图片/拍照
 * const tempFiles = await chooseMedia({ count: 1, mediaType: 'video' }); // 选择视频/录像
 */
export async function chooseMedia(option: UniApp.ChooseMediaOption) {
  if (cache.isChooseMedia) {
    const { log } = getAppConfig();
    const desc = 'Choosing media, please wait..';
    log?.('error', { name: 'chooseMedia', status: 'fail', desc, option });
    throw new Error(desc);
  }

  cache.isChooseMedia = true;
  try {
    const { tempFiles } = await promisifyUniApi(uni.chooseMedia)(option, {
      toastError: (e) => !e.errMsg.includes('cancel'),
    });
    return tempFiles;
  } finally {
    cache.isChooseMedia = false;
  }
}

/**
 * 保存图片到相册
 * @param filePath 图片路径, 可以是网络路径或本地路径
 * @example
 * await saveImageToPhotosAlbum('xx');
 */
export async function saveImageToPhotosAlbum(filePath: string, config: UniApiConfig = {}) {
  await authorize('scope.writePhotosAlbum', "请开启'添加到相册'的权限");

  if (filePath.startsWith('http')) {
    filePath = await downloadFile(filePath, { showLoading: true, ...config, toastSuccess: false });
  }

  await promisifyUniApi(uni.saveImageToPhotosAlbum)(
    { filePath },
    { toastSuccess: '保存成功', showLoading: true, ...config },
  );
}
