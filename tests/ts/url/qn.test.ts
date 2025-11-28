import { describe, it, expect } from 'vitest';
import { getQnImg, getQnVideo, getQnAudio, getQnHls } from '../../../src/ts';

function toBase64Url(s: string) {
  const b64 = Buffer.from(s, 'utf-8').toString('base64');
  return b64.replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

describe('ts/url qn utils', () => {
  it('imageView2 example from docs', () => {
    const src = 'http://dn-odum9helk.qbox.me/qiniu-picture1.jpg';
    expect(getQnImg(src, { imageView2: { mode: 0, w: 48, h: 48 } })).toBe(
      'http://dn-odum9helk.qbox.me/qiniu-picture1.jpg?imageView2/0/w/48/h/48',
    );
  });

  it('imageslim and imageInfo', () => {
    const src = 'https://cdn.example.com/a.jpg';
    expect(getQnImg(src, { imageslim: true })).toBe('https://cdn.example.com/a.jpg?imageslim');
    expect(getQnImg(src, { imageInfo: true })).toBe('https://cdn.example.com/a.jpg?imageInfo');
  });

  it('imageMogr2 common operations', () => {
    const src = 'https://cdn.example.com/a.jpg';
    expect(getQnImg(src, { thumbnail: '!50p' })).toBe(
      'https://cdn.example.com/a.jpg?imageMogr2/thumbnail/!50p',
    );
    expect(getQnImg(src, { crop: '100x100' })).toBe(
      'https://cdn.example.com/a.jpg?imageMogr2/crop/100x100',
    );
    expect(getQnImg(src, { rotate: 90 })).toBe(
      'https://cdn.example.com/a.jpg?imageMogr2/rotate/90',
    );
    expect(getQnImg(src, { 'auto-orient': true })).toBe(
      'https://cdn.example.com/a.jpg?imageMogr2/auto-orient',
    );
    expect(getQnImg(src, { format: 'webp' })).toBe(
      'https://cdn.example.com/a.jpg?imageMogr2/format/webp',
    );
    expect(getQnImg(src, { interlace: 1 })).toBe(
      'https://cdn.example.com/a.jpg?imageMogr2/interlace/1',
    );
    expect(getQnImg(src, { background: 'white' })).toBe(
      'https://cdn.example.com/a.jpg?imageMogr2/background/white',
    );
    expect(getQnImg(src, { q: 80 })).toBe('https://cdn.example.com/a.jpg?imageMogr2/q/80');
    expect(getQnImg(src, { blur: { r: 10, s: 10 } })).toBe(
      'https://cdn.example.com/a.jpg?imageMogr2/blur/10x10',
    );
    expect(getQnImg(src, { colors: 64 })).toBe(
      'https://cdn.example.com/a.jpg?imageMogr2/colors/64',
    );
  });

  it('watermark image and text', () => {
    const src = 'https://cdn.example.com/a.jpg';
    const logo = 'http://example.com/logo.png';
    const logoB64 = toBase64Url(logo);
    expect(getQnImg(src, { watermark: { type: 'image', image: logo } })).toBe(
      `https://cdn.example.com/a.jpg?watermark/1/image/${logoB64}`,
    );

    const wmText = '水印';
    const wmB64 = toBase64Url(wmText);
    expect(getQnImg(src, { watermark: { type: 'text', text: wmText, fontsize: 18 } })).toBe(
      `https://cdn.example.com/a.jpg?watermark/2/text/${wmB64}/fontsize/18`,
    );
  });

  it('combine segments and strip query on src', () => {
    const src = 'https://cdn.example.com/a.jpg?t=1';
    const url = getQnImg(src, {
      imageView2: { mode: 2, w: 100, h: 100 },
      rotate: 90,
      imageslim: true,
    });
    expect(url).toBe(
      'https://cdn.example.com/a.jpg?imageslim|imageView2/2/w/100/h/100|imageMogr2/rotate/90',
    );
  });

  it('video transcode via avthumb', () => {
    const src = 'https://cdn.example.com/a.mp4';
    const url = getQnVideo(src, {
      avthumb: { format: 'mp4', s: '1280x720', vcodec: 'libx264', vb: '1.25m' },
    });
    expect(url).toBe(
      'https://cdn.example.com/a.mp4?avthumb/mp4/s/1280x720/vcodec/libx264/vb/1.25m',
    );
  });

  it('video snapshot via vframe', () => {
    const src = 'https://cdn.example.com/a.mp4';
    const url = getQnVideo(src, {
      vframe: { format: 'jpg', offset: 3, w: 480, h: 360 },
    });
    expect(url).toBe('https://cdn.example.com/a.mp4?vframe/jpg/offset/3/w/480/h/360');
  });

  it('audio transcode via avthumb', () => {
    const src = 'https://cdn.example.com/a.aac';
    const url = getQnAudio(src, {
      avthumb: { format: 'mp3', ab: '128k', ar: 44100, acodec: 'libmp3lame' },
    });
    expect(url).toBe(
      'https://cdn.example.com/a.aac?avthumb/mp3/ab/128k/ar/44100/acodec/libmp3lame',
    );
  });

  it('hls realtime transcode example', () => {
    const src = 'http://aaa.com/sample.mp4';
    const url = getQnHls(src, { level: 3, format: 'm3u8' });
    expect(url).toBe('http://aaa.com/sample.mp4?avcvt/3/format/m3u8');
  });

  it('hls with more parameters', () => {
    const src = 'https://cdn.example.com/a.mp4';
    const output = 'playlist.m3u8';
    const url = getQnHls(src, {
      level: 3,
      format: 'm3u8',
      segtime: 6,
      vcodec: 'libx264',
      vb: '1.25m',
      r: 30,
      s: '1280x720',
      acodec: 'libfdk_aac',
      ab: '128k',
      ar: 44100,
      output,
    });
    const outB64 = toBase64Url(output);
    expect(url).toBe(
      `https://cdn.example.com/a.mp4?avcvt/3/format/m3u8/segtime/6/vcodec/libx264/vb/1.25m/r/30/s/1280x720/acodec/libfdk_aac/ab/128k/ar/44100/output/${outB64}`,
    );
  });
});
