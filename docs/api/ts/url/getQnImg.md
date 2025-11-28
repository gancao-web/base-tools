# getQnImg
qn图片处理

## Example

```ts
import { getQnImg } from '@base-web-kits/base-tools/ts';
缩略: getQnImg('xx.jpg', { imageView2: { mode: 2, w: 100, h: 100 } })
高级缩放: getQnImg('xx.jpg', { thumbnail: '!50p' })
裁剪: getQnImg('xx.jpg', { crop: '100x100' })
旋转: getQnImg('xx.jpg', { rotate: 90 })
自适应方向: getQnImg('xx.jpg', { 'auto-orient': true })
格式转换: getQnImg('xx.jpg', { format: 'webp' })
质量: getQnImg('xx.jpg', { q: 80 })
渐进显示: getQnImg('xx.jpg', { interlace: 1 })
背景色填充: getQnImg('xx.jpg', { background: 'white' })
模糊: getQnImg('xx.jpg', { blur: { r: 10, s: 10 } })
GIF颜色控制: getQnImg('xx.jpg', { colors: 64 })
图片瘦身: getQnImg('xx.jpg', { imageslim: true })
图片信息: getQnImg('xx.jpg', { imageInfo: true })
图片水印: getQnImg('xx.jpg', { watermark: { type: 'image', image: 'http://example.com/logo.png' } })
文字水印: getQnImg('xx.jpg', { watermark: { type: 'text', text: '水印', fontsize: 18 } })
```