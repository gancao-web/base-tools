# getOssAudio
oss音频处理

## Example

```ts
import { getOssAudio } from '@base-web-kits/base-tools/ts';
音频转码: getOssAudio('xx.mp3', { 'convert': { format: 'mp3' } })
音频拼接: getOssAudio('xx.mp3', { 'concat': { list: 'a.mp3,b.mp3' } })
信息查询: getOssAudio('xx.mp3', { 'info': true })
```