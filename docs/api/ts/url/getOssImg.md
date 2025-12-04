# getOSSImg

OSS图片处理

## 示例

```ts
import { getOSSImg } from '@base-web-kits/base-tools-ts';
缩放: getOSSImg('xx.jpg', { resize: { w: 100, h: 100 } });
水印: getOSSImg('xx.jpg', { watermark: { text: '水印' } });
翻转: getOSSImg('xx.jpg', { flip: 1 });
裁剪: getOSSImg('xx.jpg', { crop: { w: 100, h: 100 } });
质量: getOSSImg('xx.jpg', { quality: { q: 80 } });
格式转换: getOSSImg('xx.jpg', { format: 'jpg' });
获取信息: getOSSImg('xx.jpg', { info: true });
自适应方向: getOSSImg('xx.jpg', { 'auto-orient': 1 });
内切圆: getOSSImg('xx.jpg', { circle: { r: 100 } });
索引切割: getOSSImg('xx.jpg', { indexcrop: { x: 100 } });
圆角: getOSSImg('xx.jpg', { 'rounded-corners': { r: 10 } });
模糊: getOSSImg('xx.jpg', { blur: { r: 10, s: 10 } });
旋转: getOSSImg('xx.jpg', { rotate: 90 });
渐进显示: getOSSImg('xx.jpg', { interlace: 1 });
主色调: getOSSImg('xx.jpg', { 'average-hue': true });
亮度: getOSSImg('xx.jpg', { bright: 10 });
锐化: getOSSImg('xx.jpg', { sharpen: 100 });
对比度: getOSSImg('xx.jpg', { contrast: 100 });
```

## 版本

- 1.0.0 新增
