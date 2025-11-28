type QnOtherOption = Record<string, string | number | boolean | undefined>;

export type QnImageView2Option = {
  mode?: 0 | 1 | 2 | 3 | 4 | 5;
  w?: number;
  h?: number;
  l?: number;
  limit?: 0 | 1;
  q?: number;
  format?: string;
} & QnOtherOption;

export type QnMogr2Option = {
  thumbnail?: string;
  crop?: string;
  rotate?: number;
  'auto-orient'?: boolean;
  format?: string;
  interlace?: 0 | 1;
  background?: string;
  q?: number;
  blur?: string | { r: number; s: number };
  colors?: number;
} & QnOtherOption;

export type QnWatermarkOption = {
  type?: 'image' | 'text' | number;
  image?: string;
  text?: string;
  font?: string;
  fontsize?: number;
  fill?: string;
  gravity?: string;
  dx?: number;
  dy?: number;
  dissolve?: number;
} & QnOtherOption;

export type QnImgOption = {
  imageView2?: QnImageView2Option;
  imageMogr2?: QnMogr2Option;
  watermark?: QnWatermarkOption;
  imageslim?: boolean;
  imageInfo?: boolean;
} & {
  thumbnail?: string;
  crop?: string;
  rotate?: number;
  'auto-orient'?: boolean;
  format?: string;
  interlace?: 0 | 1;
  background?: string;
  q?: number;
  blur?: string | { r: number; s: number };
  colors?: number;
  [action: string]: number | string | boolean | Record<string, unknown> | undefined;
};

export type QnAvthumbOption = {
  format?: string;
  s?: string;
  vcodec?: 'libx264' | 'libx265' | 'copy' | string;
  vb?: string; // e.g. '1.25m', '128k', support '!'
  r?: number; // frame rate
  acodec?: 'libmp3lame' | 'libfdk_aac' | 'copy' | string;
  ab?: string; // e.g. '128k', support '!'
  ar?: number; // sampling rate
} & QnOtherOption;

export type QnVframeOption = {
  format?: 'jpg' | 'png';
  offset?: number; // seconds, support decimals
  w?: number;
  h?: number;
} & QnOtherOption;

export type QnVideoOption = {
  avthumb?: QnAvthumbOption;
  vframe?: QnVframeOption;
} & {
  [action: string]: number | string | boolean | Record<string, unknown> | undefined;
};

export type QnAudioOption = {
  avthumb?: QnAvthumbOption;
} & {
  [action: string]: number | string | boolean | Record<string, unknown> | undefined;
};

export type QnHlsOption = {
  level?: number; // e.g. 3 for 720p preset
  format?: 'm3u8';
  segtime?: number; // 2-10 seconds
  t?: string; // duration like '1.500s'
  vcodec?: 'libx264' | 'libx265' | 'copy' | string;
  vb?: string; // bitrate e.g. '1.25m', '128k', support '!'
  r?: number; // frame rate [1,60]
  s?: string; // resolution '1280x720'
  acodec?: 'libmp3lame' | 'libfdk_aac' | 'copy' | string;
  ab?: string; // audio bitrate
  ar?: number; // audio sampling rate
  output?: string; // m3u8 filename (url-safe base64)
} & QnOtherOption;
