import { getObjectKeys } from '../../object';

/**
 * 跨端 100% 原生可解码文件后缀表
 * 覆盖：iOS 14+ / Android 5+ WebView、Chrome/Edge/Safari/Firefox
 * 剔除：所有需要 polyfill 或转码的容器/编码
 */
const FILE_TYPE = {
  img: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'],
  video: ['mp4', 'mov', 'm4v'],
  voice: ['mp3', 'wav', 'm4a'],
  excel: ['csv', 'xls', 'xlsx', 'xlsm', 'ods'],
  word: ['txt', 'doc', 'docx', 'pdf', 'md', 'wps'],
  zip: ['zip', 'gz', 'tar', 'rar', '7z'],
  ppt: ['ppt', 'pptx', 'odp'],
  app: ['apk', 'ipa'],
};

/**
 * 获取文件后缀（不含点，返回小写）。
 * 当文件名不包含点（'.'）时，返回空字符串。
 * @param fileName 文件名，例如 `avatar.PNG`
 * @returns 后缀字符串，例如 `png`
 * @example getFileSuffix('avatar.PNG') // 'png'
 * @example getFileSuffix('a.tar.gz') // 'gz'
 * @example getFileSuffix('.ignore') // ''
 * @example getFileSuffix('abc') // ''
 */
export function getFileSuffix(fileName: string) {
  if (fileName.startsWith('.')) return ''; // 隐藏文件，返回空串

  const idx = fileName.lastIndexOf('.');
  return idx > 0 ? fileName.slice(idx + 1).toLowerCase() : '';
}

/**
 * 根据文件后缀判断文件类型。
 * 会将后缀转换为小写后与 `FILE_TYPE` 映射匹配；若未匹配到则返回 `'unknown'`。
 * @param fileName 文件名
 * @returns 文件类型字符串（如 'img' | 'video' | 'voice' | 'excel' | 'word' | 'zip' | 'ppt' | 'app' | 'unknown'）
 * @example getFileType('avatar.PNG') // 'img'
 * @example getFileType('archive.tar') // 'zip'
 * @example getFileType('abc') // 'unknown'
 */
export function getFileType(fileName: string) {
  const suffix = getFileSuffix(fileName);
  if (!suffix) return 'unknown';

  const keys = getObjectKeys(FILE_TYPE);
  for (const key of keys) {
    if (FILE_TYPE[key].includes(suffix)) {
      return key;
    }
  }

  return 'unknown';
}
