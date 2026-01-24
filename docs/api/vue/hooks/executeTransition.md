# executeTransition

## 描述

执行 CSS 过渡。

## 示例

```ts
import { executeTransition } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const source = ref(0);
executeTransition(source, 0, 100, { duration: 1000 });
``` 示例代码
```

## 来源

[VueUse](https://vueuse.org/functions/executeTransition/)
