import { getBaseToolsConfig, enhanceUniApi, downloadFile } from '../index';

/**
 * 拼接完整的文件地址
 * - 需在入口文件初始化应用配置 setBaseToolsConfig({ hostFile })
 * @param src 完整/相对文件地址
 */
export function getFileUrl(src?: string) {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  if (src.startsWith('/')) src = src.substring(1); // 去掉前面的'/'
  const { hostFile } = getBaseToolsConfig();
  const host = hostFile.endsWith('/') ? hostFile : `${hostFile}/`; // 确保host以/结尾
  return host + src;
}

/**
 * 拼接完整的图标地址
 * - 需在入口文件初始化应用配置 setBaseToolsConfig({ hostIcon })
 * @param src 相对图标地址
 */
export function getIconUrl(icon: string) {
  const { hostIcon } = getBaseToolsConfig();
  return hostIcon + icon;
}

/**
 * 拼接完整的图标背景: `url(${hostIcon + icon})`
 * - 需在入口文件初始化应用配置 setBaseToolsConfig({ hostIcon })
 * @param src 相对图标地址
 * @example
 * :style="{'background-image': getIconBg('xx')}"
 */
export function getIconBg(icon: string) {
  const { hostIcon } = getBaseToolsConfig();
  return `url(${hostIcon + icon})`;
}

/**
 * 打开文档
 * - 支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx
 * - 若是图片,则另用previewImage
 * @param url 完整/相对文件地址
 */
export async function openDocument(url: string) {
  if (!url) return;

  const filePath = await downloadFile({ url }, { showLoading: true });

  await enhanceUniApi(uni.openDocument, 'openDocument')(
    { filePath, showMenu: true },
    { showLoading: true },
  );
}
