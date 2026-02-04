# watchIgnorable

## 描述

可以忽略特定更新的 watch。

## 示例

````ts
import { watchIgnorable } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const source = ref('foo');

const { ignoreUpdates } = watchIgnorable(
  source,
  (v) => console.log(`Changed to ${v}`),
);

source.value = 'bar'; // Log: Changed to bar

ignoreUpdates(() => {
  source.value = 'baz'; // Ignored
});

source.value = 'qux'; // Log: Changed to qux
``` 示例代码
````

## 来源

[VueUse](https://vueuse.org/functions/watchIgnorable/)
