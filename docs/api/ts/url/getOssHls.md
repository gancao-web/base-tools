# getOssHls
oss直播处理（边转边播 HLS）

## Example

```ts
import { getOssHls } from '@base-web-kits/base-tools/ts';
生成播放列表: getOssHls('xx.mp4', { 'm3u8': true })
配置参数: getOssHls('xx.mp4', { 'm3u8': { playlist: 1, segtime: 6 } })
```