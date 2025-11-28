# getQnAudio
qn音频处理

## Example

```ts
import { getQnAudio } from '@base-web-kits/base-tools/ts';
音频转码: getQnAudio('xx.aac', { avthumb: { format: 'mp3', ab: '128k', ar: 44100, acodec: 'libmp3lame' } })
```