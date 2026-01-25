# watchThrottled

## 描述

带有节流功能的 watch。

## 示例

```ts
import { watchThrottled } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);

watchThrottled(
  count,
  (val) => {
    console.log('Changed:', val);
  },
  { throttle: 500 },
);

count.value++; // Triggered
count.value++; // Throttled
``` 示例代码
```

## 来源

[VueUse](https://vueuse.org/functions/watchThrottled/)
