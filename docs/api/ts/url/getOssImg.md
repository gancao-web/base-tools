# getOssImg

oss图片处理

## 示例

```ts
import { getOssImg } from '@base-web-kits/base-tools-ts';
缩放: getOssImg('xx.jpg', { resize: { w: 100, h: 100 } });
水印: getOssImg('xx.jpg', { watermark: { text: '水印' } });
翻转: getOssImg('xx.jpg', { flip: 1 });
裁剪: getOssImg('xx.jpg', { crop: { w: 100, h: 100 } });
质量: getOssImg('xx.jpg', { quality: { q: 80 } });
格式转换: getOssImg('xx.jpg', { format: 'jpg' });
获取信息: getOssImg('xx.jpg', { info: true });
自适应方向: getOssImg('xx.jpg', { 'auto-orient': 1 });
内切圆: getOssImg('xx.jpg', { circle: { r: 100 } });
索引切割: getOssImg('xx.jpg', { indexcrop: { x: 100 } });
圆角: getOssImg('xx.jpg', { 'rounded-corners': { r: 10 } });
模糊: getOssImg('xx.jpg', { blur: { r: 10, s: 10 } });
旋转: getOssImg('xx.jpg', { rotate: 90 });
渐进显示: getOssImg('xx.jpg', { interlace: 1 });
主色调: getOssImg('xx.jpg', { 'average-hue': true });
亮度: getOssImg('xx.jpg', { bright: 10 });
锐化: getOssImg('xx.jpg', { sharpen: 100 });
对比度: getOssImg('xx.jpg', { contrast: 100 });
```
