# watchDeep

## 描述

深度监听的 watch（相当于 `deep: true`）。

## 示例

````ts
import { watchDeep } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const state = ref({ count: 0 });

watchDeep(state, (val) => {
  console.log('Deep changed:', val);
});

state.value.count++; // Triggered
```来源

[VueUse](https://vueuse.org/functions/watchDeep/)
````
