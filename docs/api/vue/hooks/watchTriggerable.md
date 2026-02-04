# watchTriggerable

## 描述

可以手动触发的 watch。

## 示例

```ts
import { watchTriggerable } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const source = ref(0);

const { trigger, ignoreUpdates } = watchTriggerable(source, (v) => console.log(`Changed to ${v}`));

source.value = 1; // Log: Changed to 1

// 手动触发
trigger(); // Log: Changed to 1
```

## 来源

[VueUse](https://vueuse.org/functions/watchTriggerable/)
