# useMediaControls

响应式的媒体控件 (Audio/Video)。

## 示例

```ts
import { useMediaControls } from '@base-web-kits/base-tools-vue';

const { playing, volume } = useMediaControls(videoRef);
```

## 参数

- `el (Ref)`: 媒体元素引用。

## 返回值

- `(Object)`: 包含播放控制和状态的对象。

## 来源

- [VueUse useMediaControls](https://vueuse.org/core/useMediaControls/)
