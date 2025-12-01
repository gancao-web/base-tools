# getOssVideo

oss视频处理

## 示例

```ts
import { getOssVideo } from '@base-web-kits/base-tools-ts';
视频转码: getOssVideo('xx.mp4', { convert: { format: 'mp4' } });
转为动图: getOssVideo('xx.mp4', { animation: { format: 'gif' } });
雪碧图: getOssVideo('xx.mp4', { sprite: { format: 'png' } });
多帧截取: getOssVideo('xx.mp4', { snapshots: { count: 3 } });
视频拼接: getOssVideo('xx.mp4', { concat: { list: 'a.mp4,b.mp4' } });
信息查询: getOssVideo('xx.mp4', { info: true });
组合操作: getOssVideo('xx.mp4', { convert: { format: 'mp4' }, snapshots: { count: 3 } });
```
