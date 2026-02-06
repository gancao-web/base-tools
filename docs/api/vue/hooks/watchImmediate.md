# watchImmediate

## 描述

立即执行的 watch（相当于 `immediate: true`）。

## 示例

````ts
import { watchImmediate } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const source = ref(0);

watchImmediate(source, (v) => {
  console.log(`Value: ${v}`);
});
// Log: Value: 0
``` 示例代码
````

## 来源

[VueUse](https://vueuse.org/functions/watchImmediate/)
