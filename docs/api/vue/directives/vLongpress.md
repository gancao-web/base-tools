# vLongpress

长按指令：按住超过 `duration` 毫秒触发回调，默认 `500` 毫秒。

## 示例

```ts
import { vLongpress } from '@base-web-kits/base-tools-vue';
<button v-longpress="onLongpress" />
<button v-longpress="{ handler: onLongpress, duration: 800 }" />
```
