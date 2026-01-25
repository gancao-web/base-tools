# refDefault

## 描述

带默认值的 ref。

## 示例

```ts
import { refDefault } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const source = ref(undefined);
const value = refDefault(source, 'default');
```

## 来源

[VueUse](https://vueuse.org/functions/refDefault/)
