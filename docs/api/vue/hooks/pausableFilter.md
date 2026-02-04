# pausableFilter

## 描述

可暂停的过滤器。

## 示例

````ts
import { pausableFilter } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const isActive = ref(true);
const filter = pausableFilter((fn) => {
  if (isActive.value) fn();
}, isActive);
``` 示例代码
````

## 来源

[VueUse](https://vueuse.org/functions/pausableFilter/)
