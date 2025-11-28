import { describe, it, expect } from 'vitest';
import { getOssImg, getOssAudio, getOssVideo, getOssHls, buildOssUrl } from '../../../src/ts';

function toBase64Url(s: string) {
  const b64 = Buffer.from(s, 'utf-8').toString('base64');
  return b64.replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

describe('ts/url oss utils', () => {
  it('buildOssUrl base guards', () => {
    expect(buildOssUrl('', 'image', { info: true })).toBe('');
    expect(buildOssUrl('blob:abc', 'image', { info: true })).toBe('blob:abc');
    expect(buildOssUrl('a.svg', 'image', { info: true })).toBe('a.svg');
    expect(buildOssUrl('a.jpg?x=1', 'image', { info: false })).toBe('a.jpg?x=1');
  });

  it('image processing examples', () => {
    const src = 'https://cdn.example.com/a.jpg';
    expect(getOssImg(src, { resize: { w: 100, h: 100 } })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/resize,w_100,h_100',
    );
    const wmText = toBase64Url('水印');
    expect(getOssImg(src, { watermark: { text: '水印' } })).toBe(
      `https://cdn.example.com/a.jpg?x-oss-process=image/watermark,text_${wmText}`,
    );
    expect(getOssImg(src, { flip: 1 })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/flip,1',
    );
    expect(getOssImg(src, { crop: { w: 100, h: 100 } })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/crop,w_100,h_100',
    );
    expect(getOssImg(src, { quality: { q: 80 } })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/quality,q_80',
    );
    expect(getOssImg(src, { format: 'jpg' })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/format,jpg',
    );
    expect(getOssImg(src, { info: true })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/info',
    );
    expect(getOssImg(src, { 'auto-orient': 1 })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/auto-orient,1',
    );
    expect(getOssImg(src, { circle: { r: 100 } })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/circle,r_100',
    );
    expect(getOssImg(src, { indexcrop: { x: 100 } })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/indexcrop,x_100',
    );
    expect(getOssImg(src, { 'rounded-corners': { r: 10 } })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/rounded-corners,r_10',
    );
    expect(getOssImg(src, { blur: { r: 10, s: 10 } })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/blur,r_10,s_10',
    );
    expect(getOssImg(src, { rotate: 90 })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/rotate,90',
    );
    expect(getOssImg(src, { interlace: 1 })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/interlace,1',
    );
    expect(getOssImg(src, { 'average-hue': true })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/average-hue',
    );
    expect(getOssImg(src, { bright: 10 })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/bright,10',
    );
    expect(getOssImg(src, { sharpen: 100 })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/sharpen,100',
    );
    expect(getOssImg(src, { contrast: 100 })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/contrast,100',
    );
    expect(getOssImg(`${src}?t=1`, { format: 'png' })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/format,png',
    );
    expect(getOssImg(src, { rotate: 0 })).toBe(
      'https://cdn.example.com/a.jpg?x-oss-process=image/rotate,0',
    );
  });

  it('audio processing examples', () => {
    const src = 'https://cdn.example.com/a.mp3';
    expect(getOssAudio(src, { convert: { format: 'mp3' } })).toBe(
      'https://cdn.example.com/a.mp3?x-oss-process=audio/convert,format_mp3',
    );
    expect(getOssAudio(src, { concat: { list: 'a.mp3,b.mp3' } })).toBe(
      'https://cdn.example.com/a.mp3?x-oss-process=audio/concat,list_a.mp3,b.mp3',
    );
    expect(getOssAudio(src, { info: true })).toBe(
      'https://cdn.example.com/a.mp3?x-oss-process=audio/info',
    );
  });

  it('video processing examples', () => {
    const src = 'https://cdn.example.com/a.mp4';
    expect(getOssVideo(src, { convert: { format: 'mp4' } })).toBe(
      'https://cdn.example.com/a.mp4?x-oss-process=video/convert,format_mp4',
    );
    expect(getOssVideo(src, { animation: { format: 'gif' } })).toBe(
      'https://cdn.example.com/a.mp4?x-oss-process=video/animation,format_gif',
    );
    expect(getOssVideo(src, { sprite: { format: 'png' } })).toBe(
      'https://cdn.example.com/a.mp4?x-oss-process=video/sprite,format_png',
    );
    expect(getOssVideo(src, { snapshots: { count: 3 } })).toBe(
      'https://cdn.example.com/a.mp4?x-oss-process=video/snapshots,count_3',
    );
    expect(getOssVideo(src, { concat: { list: 'a.mp4,b.mp4' } })).toBe(
      'https://cdn.example.com/a.mp4?x-oss-process=video/concat,list_a.mp4,b.mp4',
    );
    expect(getOssVideo(src, { info: true })).toBe(
      'https://cdn.example.com/a.mp4?x-oss-process=video/info',
    );
    expect(getOssVideo(src, { convert: { format: 'mp4' }, snapshots: { count: 3 } })).toBe(
      'https://cdn.example.com/a.mp4?x-oss-process=video/convert,format_mp4/snapshots,count_3',
    );
  });

  it('hls processing examples', () => {
    const src = 'https://cdn.example.com/a.mp4';
    expect(getOssHls(src, { m3u8: true })).toBe(
      'https://cdn.example.com/a.mp4?x-oss-process=hls/m3u8',
    );
    expect(getOssHls(src, { m3u8: { playlist: 1, segtime: 6 } })).toBe(
      'https://cdn.example.com/a.mp4?x-oss-process=hls/m3u8,playlist_1,segtime_6',
    );
  });
});
