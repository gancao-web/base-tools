# autoResetRef

## 描述

自动重置的 ref (refAutoReset 的别名)。

## 示例

```ts
import { autoResetRef } from '@base-web-kits/base-tools-vue';

const message = autoResetRef('default', 1000);
message.value = 'changed'; // 1s 后重置为 'default'
```来源

[VueUse](https://vueuse.org/functions/autoResetRef/)
