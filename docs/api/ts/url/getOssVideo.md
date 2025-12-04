# getOSSVideo

OSS视频处理

## 示例

```ts
import { getOSSVideo } from '@base-web-kits/base-tools-ts';
视频转码: getOSSVideo('xx.mp4', { convert: { format: 'mp4' } });
转为动图: getOSSVideo('xx.mp4', { animation: { format: 'gif' } });
雪碧图: getOSSVideo('xx.mp4', { sprite: { format: 'png' } });
多帧截取: getOSSVideo('xx.mp4', { snapshots: { count: 3 } });
视频拼接: getOSSVideo('xx.mp4', { concat: { list: 'a.mp4,b.mp4' } });
信息查询: getOSSVideo('xx.mp4', { info: true });
组合操作: getOSSVideo('xx.mp4', { convert: { format: 'mp4' }, snapshots: { count: 3 } });
```

## 版本

- 1.0.0 新增
