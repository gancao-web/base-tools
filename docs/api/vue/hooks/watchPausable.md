# watchPausable

## 描述

可暂停和恢复的 watch。

## 示例

```ts
import { watchPausable } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const source = ref('foo');

const { stop, pause, resume, isActive } = watchPausable(source, (v) =>
  console.log(`Changed to ${v}`),
);

source.value = 'bar'; // Log: Changed to bar

pause();

source.value = 'baz'; // Ignored

resume();

source.value = 'qux'; // Log: Changed to qux
```

## 来源

[VueUse](https://vueuse.org/functions/watchPausable/)
