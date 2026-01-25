# useSupported

## 描述

检查 API 是否支持。

## 示例

```ts
import { useSupported } from '@base-web-kits/base-tools-vue';

const isSupported = useSupported(() => 'navigator' in window && 'bluetooth' in navigator);
```

## 来源

[VueUse](https://vueuse.org/functions/useSupported/)
