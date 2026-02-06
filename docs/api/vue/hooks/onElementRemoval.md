# onElementRemoval

## 描述

元素被移除事件钩子。

## 示例

````ts
import { onElementRemoval } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const el = ref(null);
onElementRemoval(el, () => {
  console.log('element removed');
});
``` 示例代码
````

## 来源

[VueUse](https://vueuse.org/functions/onElementRemoval/)
