import type {
  OSSOption,
  OSSAudioOption,
  OSSHlsOption,
  OSSImgOption,
  OSSVideoOption,
  OSSWatermarkOption,
} from './index.d';

export * from './index.d';

/**
 * oss图片处理
 * 参考官方文档: https://help.aliyun.com/zh/oss/user-guide/img-parameters/?spm=a2c4g.11186623.help-menu-31815.d_0_11_2_1.572824a1a1W5Pf&scm=20140722.H_144582._.OR_help-T_cn~zh-V_1
 * @param src 原始图片URL
 * @param option 图片处理选项
 * @returns 处理后的图片URL（格式: `{src}?x-oss-process=image/xx`）
 * @example
 * 缩放: getOSSImg('xx.jpg', { resize: { w: 100, h: 100 } })
 * 水印: getOSSImg('xx.jpg', { watermark: { text: '水印' } });
 * 翻转: getOSSImg('xx.jpg', { flip: 1 });
 * 裁剪: getOSSImg('xx.jpg', { crop: { w: 100, h: 100 } });
 * 质量: getOSSImg('xx.jpg', { quality: { q: 80 } });
 * 格式转换: getOSSImg('xx.jpg', { format: 'jpg' });
 * 获取信息: getOSSImg('xx.jpg', { info: true });
 * 自适应方向: getOSSImg('xx.jpg', { 'auto-orient': 1 });
 * 内切圆: getOSSImg('xx.jpg', { circle: { r: 100 } });
 * 索引切割: getOSSImg('xx.jpg', { indexcrop: { x: 100 } });
 * 圆角: getOSSImg('xx.jpg', { 'rounded-corners': { r: 10 } });
 * 模糊: getOSSImg('xx.jpg', { blur: { r: 10, s: 10 } });
 * 旋转: getOSSImg('xx.jpg', { rotate: 90 });
 * 渐进显示: getOSSImg('xx.jpg', { interlace: 1 });
 * 主色调: getOSSImg('xx.jpg', { 'average-hue': true });
 * 亮度: getOSSImg('xx.jpg', { bright: 10 });
 * 锐化: getOSSImg('xx.jpg', { sharpen: 100 });
 * 对比度: getOSSImg('xx.jpg', { contrast: 100 });
 */
export function getOSSImg(src: string, option: OSSImgOption) {
  return buildOSSUrl(src, 'image', option);
}

/**
 * oss视频处理
 * 参考官方文档: https://help.aliyun.com/zh/oss/user-guide/audio-and-video-processing/
 * @param src 原始视频URL
 * @param option 视频处理选项
 * @returns 处理后的URL（格式: `{src}?x-oss-process=video/xx`）
 * @example
 * 视频转码: getOSSVideo('xx.mp4', { convert: { format: 'mp4' } })
 * 转为动图: getOSSVideo('xx.mp4', { animation: { format: 'gif' } })
 * 雪碧图: getOSSVideo('xx.mp4', { sprite: { format: 'png' } })
 * 多帧截取: getOSSVideo('xx.mp4', { snapshots: { count: 3 } })
 * 视频拼接: getOSSVideo('xx.mp4', { concat: { list: 'a.mp4,b.mp4' } })
 * 信息查询: getOSSVideo('xx.mp4', { info: true })
 * 组合操作: getOSSVideo('xx.mp4', { convert: { format: 'mp4' }, snapshots: { count: 3 } })
 */
export function getOSSVideo(src: string, option: OSSVideoOption) {
  return buildOSSUrl(src, 'video', option);
}

/**
 * oss音频处理
 * 参考官方文档: https://help.aliyun.com/zh/oss/user-guide/audio-and-video-processing/
 * @param src 原始音频URL
 * @param option 音频处理选项
 * @returns 处理后的URL（格式: `{src}?x-oss-process=audio/xx`）
 * @example
 * 音频转码: getOSSAudio('xx.mp3', { 'convert': { format: 'mp3' } })
 * 音频拼接: getOSSAudio('xx.mp3', { 'concat': { list: 'a.mp3,b.mp3' } })
 * 信息查询: getOSSAudio('xx.mp3', { 'info': true })
 */
export function getOSSAudio(src: string, option: OSSAudioOption) {
  return buildOSSUrl(src, 'audio', option);
}

/**
 * oss直播处理（边转边播 HLS）
 * 参考官方文档: https://help.aliyun.com/zh/oss/user-guide/audio-and-video-processing/
 * @param src 原始视频URL
 * @param option HLS 选项（或布尔）
 * @returns 处理后的URL（格式: `{src}?x-oss-process=hls/xx`）
 * @example
 * 生成播放列表: getOSSHls('xx.mp4', { 'm3u8': true })
 * 配置参数: getOSSHls('xx.mp4', { 'm3u8': { playlist: 1, segtime: 6 } })
 */
export function getOSSHls(src: string, option: OSSHlsOption) {
  return buildOSSUrl(src, 'hls', option);
}

/**
 * 构造oss处理地址
 * @param src 原始地址
 * @param type oss处理类型,如`image`, `audio`, `video`, `hls`
 * @param option oss处理选项
 * @returns 处理后的URL（格式: `{src}?x-oss-process={type}/{segs.join('/')}`）
 */
export function buildOSSUrl(src: string, type: string, option: OSSOption) {
  if (!src || !option) return src;
  if (src.startsWith('blob:')) return src;
  if (src.includes('.svg')) return src;

  const segs: string[] = [];

  // 遍历选项,构造处理参数
  for (const [k, v] of Object.entries(option)) {
    const seg = k === 'watermark' ? getWatermark(v as OSSWatermarkOption) : getOSSSegs(k, v);
    if (seg) segs.push(seg);
  }

  if (!segs.length) return src;

  // 拼接处理参数(先移除查询参数,避免重复拼接)
  const base = src.split('?')[0];
  return `${base}?x-oss-process=${type}/${segs.join('/')}`;
}

/**
 * 构造图片处理参数
 * @param type 图片处理类型,如`resize`, `flip`, `format`, `info`
 * @param option 图片处理选项
 * @returns `object`返回格式为`resize,w_100,h_100`
 * @returns `number`返回格式为`flip,1`
 * @returns `string`返回格式为`format,jpg`
 * @returns `true`返回格式为`info`, `false`返回空字符串
 */
function getOSSSegs(type: string, option?: Record<string, unknown> | number | string | boolean) {
  if (!option && option !== 0) return '';

  if (option === true) return type;

  if (typeof option === 'number' || typeof option === 'string') return `${type},${option}`;

  const segs = Object.entries(option)
    .map(([k, v]) => `${k}_${v}`)
    .join(',');

  return segs ? `${type},${segs}` : '';
}

/**
 * 图片水印 (文本和图片已Base64编码)
 * @returns 格式: `watermark,text_xxx`
 */
function getWatermark(w?: OSSWatermarkOption) {
  if (!w) return '';
  if (w.image) w.image = toBase64Url(w.image);
  if (w.text) w.text = toBase64Url(w.text);
  if (w.type) w.type = toBase64Url(w.type);
  return getOSSSegs('watermark', w);
}

/**
 * Base64编码
 */
function toBase64Url(s: string) {
  let b64 = '';
  if (typeof Buffer !== 'undefined') {
    const buf = Buffer.from(s, 'utf-8');
    b64 = buf.toString('base64');
  } else {
    try {
      b64 = btoa(unescape(encodeURIComponent(s)));
    } catch {
      b64 = '';
    }
  }
  return b64.replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
