# isDefined

## 描述

检查值是否已定义。

## 示例

```ts
import { isDefined } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
if (isDefined(count)) {
  console.log(count.value);
}
```

## 来源

[VueUse](https://vueuse.org/functions/isDefined/)
