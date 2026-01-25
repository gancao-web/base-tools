# whenever

## 描述

监听源真值变化的简写，仅在值为 truthy 时触发回调。

## 示例

```ts
import { whenever } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);

whenever(
  () => count.value > 5,
  () => {
    console.log('Count is greater than 5!');
  },
);

count.value = 6; // 触发回调
```

## 来源

[VueUse](https://vueuse.org/functions/whenever/)
