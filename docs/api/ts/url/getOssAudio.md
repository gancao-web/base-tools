# getOSSAudio

OSS音频处理

## 示例

```ts
import { getOSSAudio } from '@base-web-kits/base-tools-ts';
音频转码: getOSSAudio('xx.mp3', { convert: { format: 'mp3' } });
音频拼接: getOSSAudio('xx.mp3', { concat: { list: 'a.mp3,b.mp3' } });
信息查询: getOSSAudio('xx.mp3', { info: true });
```
