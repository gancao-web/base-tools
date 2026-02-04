# debounceFilter

## 描述

防抖过滤器。

## 示例

````ts
import { debounceFilter, watchWithFilter } from '@base-web-kits/base-tools-vue';

watchWithFilter(source, cb, { eventFilter: debounceFilter(1000) });
``` 示例代码
````

## 来源

[VueUse](https://vueuse.org/functions/debounceFilter/)
