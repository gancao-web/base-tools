// 兼容oss后期添加的参数
type OtherOption = Record<string, string | number | boolean | undefined>;

export type OssGravity = 'nw' | 'north' | 'ne' | 'west' | 'center' | 'east' | 'sw' | 'south' | 'se';

export type OssFormat = 'png' | 'jpg' | 'jpeg' | 'webp' | 'bmp' | 'gif' | 'tiff' | 'heic' | 'avif';

export type OssResizeOption = {
  p?: number;
  w?: number;
  h?: number;
  m?: 'lfit' | 'mfit' | 'fill' | 'pad' | 'fixed';
  l?: number;
  s?: number;
  limit?: 1 | 0;
  color?: string;
} & OtherOption;

export type OssCropOption = {
  w?: number;
  h?: number;
  x?: number;
  y?: number;
  g?: OssGravity;
  p?: number;
} & OtherOption;

export type OssIndexCropOption = {
  x?: number;
  y?: number;
  i?: number;
} & OtherOption;

export type OssQualityOption = {
  q?: number;
  Q?: number;
} & OtherOption;

export type OssWatermarkOption = {
  type?: string;
  text?: string;
  size?: number;
  color?: string;
  shadow?: number;
  t?: number;
  g?: OssGravity;
  x?: number;
  y?: number;
  voffset?: number;
  fill?: 0 | 1;
  padx?: number;
  pady?: number;
  image?: string;
  P?: number;
} & OtherOption;

export type OssBlurOption = {
  r: number;
  s: number;
  g?: 'face' | 'faces';
  p?: number;
} & OtherOption;

export type OssRoundedCornersOption = {
  r: number;
} & OtherOption;

export type OssCircleOption = {
  r: number;
} & OtherOption;

export type OssImgOption = {
  resize?: OssResizeOption;
  watermark?: OssWatermarkOption;
  flip?: 0 | 1 | 2;
  crop?: OssCropOption;
  quality?: OssQualityOption;
  format?: OssFormat;
  info?: boolean;
  'auto-orient'?: 0 | 1;
  circle?: OssCircleOption;
  indexcrop?: OssIndexCropOption;
  'rounded-corners'?: OssRoundedCornersOption;
  blur?: OssBlurOption;
  rotate?: number;
  interlace?: 0 | 1;
  'average-hue'?: boolean;
  bright?: number;
  sharpen?: number;
  contrast?: number;
} & {
  [action: string]: number | string | boolean | Record<string, unknown> | undefined;
};

export type OssVideoOption = {
  convert?: Record<string, unknown>;
  animation?: Record<string, unknown>;
  sprite?: Record<string, unknown>;
  snapshots?: Record<string, unknown>;
  concat?: Record<string, unknown>;
  info?: boolean;
} & {
  [action: string]: number | string | boolean | Record<string, unknown> | undefined;
};

export type OssAudioOption = {
  convert?: Record<string, unknown>;
  concat?: Record<string, unknown>;
  info?: boolean;
} & {
  [action: string]: number | string | boolean | Record<string, unknown> | undefined;
};

export type OssHlsOption = {
  m3u8?: boolean | Record<string, unknown>;
} & {
  [action: string]: number | string | boolean | Record<string, unknown> | undefined;
};

export type OssOption = OssImgOption | OssVideoOption | OssAudioOption | OssHlsOption;
