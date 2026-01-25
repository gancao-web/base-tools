# createFilterWrapper

## 描述

创建过滤器包装器。

## 示例

```ts
import { createFilterWrapper, debounceFilter } from '@base-web-kits/base-tools-vue';

const debouncedFn = createFilterWrapper(debounceFilter(1000), (val) => console.log(val));
``` 示例代码
```

## 来源

[VueUse](https://vueuse.org/functions/createFilterWrapper/)
