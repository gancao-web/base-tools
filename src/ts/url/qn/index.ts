import type { QnImgOption, QnMogr2Option, QnWatermarkOption, QnImageView2Option } from './index.d';

export * from './index.d';

/**
 * qn图片处理
 * 参考官方文档: https://developer.qiniu.com/kodo/8623/dev-the-picture-style
 * @param src 原始图片URL
 * @param option 图片处理选项
 * @returns 处理后的图片URL（格式: `{src}?imageView2/...|imageMogr2/...|watermark/...|imageslim|imageInfo`）
 * @example
 * 缩略: getQnImg('xx.jpg', { imageView2: { mode: 2, w: 100, h: 100 } })
 * 高级缩放: getQnImg('xx.jpg', { thumbnail: '!50p' })
 * 裁剪: getQnImg('xx.jpg', { crop: '100x100' })
 * 旋转: getQnImg('xx.jpg', { rotate: 90 })
 * 自适应方向: getQnImg('xx.jpg', { 'auto-orient': true })
 * 格式转换: getQnImg('xx.jpg', { format: 'webp' })
 * 质量: getQnImg('xx.jpg', { q: 80 })
 * 渐进显示: getQnImg('xx.jpg', { interlace: 1 })
 * 背景色填充: getQnImg('xx.jpg', { background: 'white' })
 * 模糊: getQnImg('xx.jpg', { blur: { r: 10, s: 10 } })
 * GIF颜色控制: getQnImg('xx.jpg', { colors: 64 })
 * 图片瘦身: getQnImg('xx.jpg', { imageslim: true })
 * 图片信息: getQnImg('xx.jpg', { imageInfo: true })
 * 图片水印: getQnImg('xx.jpg', { watermark: { type: 'image', image: 'http://example.com/logo.png' } })
 * 文字水印: getQnImg('xx.jpg', { watermark: { type: 'text', text: '水印', fontsize: 18 } })
 */
export function getQnImg(src: string, option: QnImgOption) {
  if (!src || !option) return src;
  if (src.startsWith('blob:')) return src;
  if (src.includes('.svg')) return src;

  const segs: string[] = [];

  if (option.imageslim) segs.push('imageslim');

  if (option.imageView2) segs.push(getImageView2(option.imageView2));

  const mogr = getImageMogr2(option.imageMogr2 ?? option);
  if (mogr) segs.push(mogr);

  if (option.watermark) segs.push(getWatermark(option.watermark));

  if (option.imageInfo) segs.push('imageInfo');

  if (!segs.length) return src;

  const base = src.split('?')[0];
  return `${base}?${segs.join('|')}`;
}

/**
 * qn视频处理
 * 参考官方文档: https://developer.qiniu.com/kodo/12654/video-process
 * @param src 原始视频URL
 * @param option 视频处理选项（支持 avthumb、vframe）
 * @returns 处理后的URL（格式: `{src}?avthumb/...|vframe/...`）
 * @example
 * 视频转码: getQnVideo('xx.mp4', { avthumb: { format: 'mp4', s: '1280x720', vcodec: 'libx264', vb: '1.25m' } })
 * 截帧: getQnVideo('xx.mp4', { vframe: { format: 'jpg', offset: 3, w: 480, h: 360 } })
 */
export function getQnVideo(src: string, option: import('.').QnVideoOption) {
  if (!src || !option) return src;
  if (src.startsWith('blob:')) return src;
  if (src.includes('.svg')) return src;
  const segs: string[] = [];
  if (option.avthumb) segs.push(getAvthumb(option.avthumb));
  if (option.vframe) segs.push(getVframe(option.vframe));
  if (!segs.length) return src;
  const base = src.split('?')[0];
  return `${base}?${segs.join('|')}`;
}

/**
 * qn音频处理
 * 参考官方文档: https://developer.qiniu.com/kodo/12654/video-process
 * @param src 原始音频URL
 * @param option 音频处理选项（通过 avthumb 转码）
 * @returns 处理后的URL（格式: `{src}?avthumb/...`）
 * @example
 * 音频转码: getQnAudio('xx.aac', { avthumb: { format: 'mp3', ab: '128k', ar: 44100, acodec: 'libmp3lame' } })
 */
export function getQnAudio(src: string, option: import('.').QnAudioOption) {
  if (!src || !option) return src;
  if (src.startsWith('blob:')) return src;
  const segs: string[] = [];
  if (option.avthumb) segs.push(getAvthumb(option.avthumb));
  if (!segs.length) return src;
  const base = src.split('?')[0];
  return `${base}?${segs.join('|')}`;
}

/**
 * qn实时转码（HLS 边转边播）
 * 参考官方文档: https://developer.qiniu.com/kodo/12654/video-process、实时转码
 * @param src 原始视频URL
 * @param option HLS 选项
 * @returns 处理后的URL（格式: `{src}?avcvt/{level}/format/m3u8/...`）
 * @example
 * 720P HLS: getQnHls('xx.mp4', { level: 3, format: 'm3u8', segtime: 6 })
 */
export function getQnHls(src: string, option: import('.').QnHlsOption) {
  if (!src || !option) return src;
  if (src.startsWith('blob:')) return src;
  const seg = getAvcvt(option);
  if (!seg) return src;
  const base = src.split('?')[0];
  return `${base}?${seg}`;
}

function getImageView2(opt?: QnImageView2Option) {
  if (!opt) return '';
  const mode = typeof opt.mode === 'number' ? opt.mode : 0;
  const kv: string[] = [];
  for (const [k, v] of Object.entries(opt)) {
    if (k === 'mode') continue;
    if (typeof v === 'boolean') {
      if (v) kv.push(`${k}/1`);
    } else if (typeof v === 'number' || typeof v === 'string') {
      kv.push(`${k}/${v}`);
    }
  }
  return kv.length ? `imageView2/${mode}/${kv.join('/')}` : `imageView2/${mode}`;
}

function getImageMogr2(opt?: QnMogr2Option | QnImgOption) {
  if (!opt) return '';
  const parts: string[] = [];

  const tn = (opt as QnMogr2Option).thumbnail;
  if (typeof tn !== 'undefined') parts.push(`thumbnail/${tn}`);

  const cp = (opt as QnMogr2Option).crop;
  if (typeof cp !== 'undefined') parts.push(`crop/${cp}`);

  const rot = (opt as QnMogr2Option).rotate;
  if (typeof rot === 'number') parts.push(`rotate/${rot}`);

  const ao = (opt as QnMogr2Option)['auto-orient'];
  if (ao) parts.push('auto-orient');

  const fmt = (opt as QnMogr2Option).format;
  if (typeof fmt === 'string') parts.push(`format/${fmt}`);

  const il = (opt as QnMogr2Option).interlace;
  if (il === 0 || il === 1) parts.push(`interlace/${il}`);

  const bg = (opt as QnMogr2Option).background;
  if (typeof bg === 'string') parts.push(`background/${bg}`);

  const q = (opt as QnMogr2Option).q;
  if (typeof q === 'number') parts.push(`q/${q}`);

  const blur = (opt as QnMogr2Option).blur;
  if (typeof blur !== 'undefined') {
    if (typeof blur === 'string') parts.push(`blur/${blur}`);
    else parts.push(`blur/${blur.r}x${blur.s}`);
  }

  const colors = (opt as QnMogr2Option).colors;
  if (typeof colors === 'number') parts.push(`colors/${colors}`);

  return parts.length ? `imageMogr2/${parts.join('/')}` : '';
}

function getWatermark(w?: QnWatermarkOption) {
  if (!w) return '';
  const mode =
    w.type === 'image' ? 1 : w.type === 'text' ? 2 : typeof w.type === 'number' ? w.type : 2;
  const segs: string[] = [`watermark/${mode}`];
  if (mode === 1 && w.image) segs.push(`image/${toBase64Url(w.image)}`);
  if (mode === 2 && w.text) segs.push(`text/${toBase64Url(w.text)}`);
  if (w.font) segs.push(`font/${toBase64Url(w.font)}`);
  if (typeof w.fontsize === 'number') segs.push(`fontsize/${w.fontsize}`);
  if (w.fill) segs.push(`fill/${toBase64Url(w.fill)}`);
  if (w.gravity) segs.push(`gravity/${w.gravity}`);
  if (typeof w.dx === 'number') segs.push(`dx/${w.dx}`);
  if (typeof w.dy === 'number') segs.push(`dy/${w.dy}`);
  if (typeof w.dissolve === 'number') segs.push(`dissolve/${w.dissolve}`);
  return segs.join('/');
}

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

function getAvthumb(opt: import('.').QnAvthumbOption) {
  const parts: string[] = [];
  if (opt.format) parts.push(`avthumb/${opt.format}`);
  else parts.push('avthumb');
  if (opt.s) parts.push(`s/${opt.s}`);
  if (opt.vcodec) parts.push(`vcodec/${opt.vcodec}`);
  if (typeof opt.vb !== 'undefined') parts.push(`vb/${opt.vb}`);
  if (typeof opt.r === 'number') parts.push(`r/${opt.r}`);
  if (typeof opt.ab !== 'undefined') parts.push(`ab/${opt.ab}`);
  if (typeof opt.ar === 'number') parts.push(`ar/${opt.ar}`);
  if (opt.acodec) parts.push(`acodec/${opt.acodec}`);
  return parts.join('/');
}

function getVframe(opt: import('.').QnVframeOption) {
  const parts: string[] = [];
  parts.push(`vframe/${opt.format || 'jpg'}`);
  if (typeof opt.offset === 'number') parts.push(`offset/${opt.offset}`);
  if (typeof opt.w === 'number') parts.push(`w/${opt.w}`);
  if (typeof opt.h === 'number') parts.push(`h/${opt.h}`);
  return parts.join('/');
}

function getAvcvt(opt: import('.').QnHlsOption) {
  const parts: string[] = [];
  const level = typeof opt.level === 'number' ? `/${opt.level}` : '/3';
  parts.push(`avcvt${level}`);
  parts.push(`format/${opt.format || 'm3u8'}`);
  if (typeof opt.segtime === 'number') parts.push(`segtime/${opt.segtime}`);
  if (typeof opt.t === 'string') parts.push(`t/${opt.t}`);
  if (opt.vcodec) parts.push(`vcodec/${opt.vcodec}`);
  if (typeof opt.vb !== 'undefined') parts.push(`vb/${opt.vb}`);
  if (typeof opt.r === 'number') parts.push(`r/${opt.r}`);
  if (typeof opt.s === 'string') parts.push(`s/${opt.s}`);
  if (opt.acodec) parts.push(`acodec/${opt.acodec}`);
  if (typeof opt.ab !== 'undefined') parts.push(`ab/${opt.ab}`);
  if (typeof opt.ar === 'number') parts.push(`ar/${opt.ar}`);
  if (typeof opt.output === 'string') parts.push(`output/${toBase64Url(opt.output)}`);
  return parts.join('/');
}
