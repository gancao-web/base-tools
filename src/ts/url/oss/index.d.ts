// 兼容oss后期添加的参数
type OtherOption = Record<string, string | number | boolean | undefined>;

export type OSSGravity = 'nw' | 'north' | 'ne' | 'west' | 'center' | 'east' | 'sw' | 'south' | 'se';

export type OSSFormat = 'png' | 'jpg' | 'jpeg' | 'webp' | 'bmp' | 'gif' | 'tiff' | 'heic' | 'avif';

export type OSSResizeOption = {
  p?: number;
  w?: number;
  h?: number;
  m?: 'lfit' | 'mfit' | 'fill' | 'pad' | 'fixed';
  l?: number;
  s?: number;
  limit?: 1 | 0;
  color?: string;
} & OtherOption;

export type OSSCropOption = {
  w?: number;
  h?: number;
  x?: number;
  y?: number;
  g?: OSSGravity;
  p?: number;
} & OtherOption;

export type OSSIndexCropOption = {
  x?: number;
  y?: number;
  i?: number;
} & OtherOption;

export type OSSQualityOption = {
  q?: number;
  Q?: number;
} & OtherOption;

export type OSSWatermarkOption = {
  type?: string;
  text?: string;
  size?: number;
  color?: string;
  shadow?: number;
  t?: number;
  g?: OSSGravity;
  x?: number;
  y?: number;
  voffset?: number;
  fill?: 0 | 1;
  padx?: number;
  pady?: number;
  image?: string;
  P?: number;
} & OtherOption;

export type OSSBlurOption = {
  r: number;
  s: number;
  g?: 'face' | 'faces';
  p?: number;
} & OtherOption;

export type OSSRoundedCornersOption = {
  r: number;
} & OtherOption;

export type OSSCircleOption = {
  r: number;
} & OtherOption;

export type OSSImgOption = {
  resize?: OSSResizeOption;
  watermark?: OSSWatermarkOption;
  flip?: 0 | 1 | 2;
  crop?: OSSCropOption;
  quality?: OSSQualityOption;
  format?: OSSFormat;
  info?: boolean;
  'auto-orient'?: 0 | 1;
  circle?: OSSCircleOption;
  indexcrop?: OSSIndexCropOption;
  'rounded-corners'?: OSSRoundedCornersOption;
  blur?: OSSBlurOption;
  rotate?: number;
  interlace?: 0 | 1;
  'average-hue'?: boolean;
  bright?: number;
  sharpen?: number;
  contrast?: number;
} & {
  [action: string]: number | string | boolean | Record<string, unknown> | undefined;
};

export type OSSVideoOption = {
  convert?: Record<string, unknown>;
  animation?: Record<string, unknown>;
  sprite?: Record<string, unknown>;
  snapshots?: Record<string, unknown>;
  concat?: Record<string, unknown>;
  info?: boolean;
} & {
  [action: string]: number | string | boolean | Record<string, unknown> | undefined;
};

export type OSSAudioOption = {
  convert?: Record<string, unknown>;
  concat?: Record<string, unknown>;
  info?: boolean;
} & {
  [action: string]: number | string | boolean | Record<string, unknown> | undefined;
};

export type OSSHlsOption = {
  m3u8?: boolean | Record<string, unknown>;
} & {
  [action: string]: number | string | boolean | Record<string, unknown> | undefined;
};

export type OSSOption = OSSImgOption | OSSVideoOption | OSSAudioOption | OSSHlsOption;
