# watchArray

## 描述

监听数组变化的 watch，提供 added 和 removed 列表。

## 示例

````ts
import { watchArray } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const list = ref([1, 2, 3]);

watchArray(list, (newList, oldList, added, removed) => {
  console.log('Added:', added);
  console.log('Removed:', removed);
});

list.value.push(4); // Added: [4], Removed: []
```来源

[VueUse](https://vueuse.org/functions/watchArray/)
````
