# useUserMedia

## 描述

响应式的 MediaDevices.getUserMedia。

## 示例

```ts
import { useUserMedia } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const video = ref<HTMLVideoElement>();
const { stream, start, stop, enabled } = useUserMedia({
  video: true,
  audio: false,
});

if (video.value && stream.value)
  video.value.srcObject = stream.value;
```

## 来源

[VueUse](https://vueuse.org/functions/useUserMedia/)
