# getOSSHls

OSS直播处理（边转边播 HLS）

## 示例

```ts
import { getOSSHls } from '@base-web-kits/base-tools-ts';
生成播放列表: getOSSHls('xx.mp4', { m3u8: true });
配置参数: getOSSHls('xx.mp4', { m3u8: { playlist: 1, segtime: 6 } });
```

## 版本

- 1.0.0 新增
