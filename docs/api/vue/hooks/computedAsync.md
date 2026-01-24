# computedAsync

## 描述

异步的 computed。

## 示例

```ts
import { computedAsync } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const packageName = ref('vue');
const downloads = computedAsync(async () => {
  const response = await fetch(`https://api.npmjs.org/downloads/point/last-week/${packageName.value}`);
  const data = await response.json();
  return data.downloads;
}, 0);
```来源

[VueUse](https://vueuse.org/functions/computedAsync/)
