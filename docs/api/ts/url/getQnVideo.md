# getQnVideo

qn视频处理

## 示例

```ts
import { getQnVideo } from '@base-web-kits/base-tools-ts';
视频转码: getQnVideo('xx.mp4', {
  avthumb: { format: 'mp4', s: '1280x720', vcodec: 'libx264', vb: '1.25m' },
});
截帧: getQnVideo('xx.mp4', { vframe: { format: 'jpg', offset: 3, w: 480, h: 360 } });
```

## 版本

- 1.0.0 新增
