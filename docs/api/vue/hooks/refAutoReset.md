# refAutoReset

## 描述

自动重置的 ref。

## 示例

```ts
import { refAutoReset } from '@base-web-kits/base-tools-vue';

const message = refAutoReset('default', 1000);
message.value = 'changed'; // 1s 后重置为 'default'
```

## 来源

[VueUse](https://vueuse.org/functions/refAutoReset/)
