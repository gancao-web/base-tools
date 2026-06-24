# createDisposableDirective

## 描述

创建一个可在指令卸载时自动清理副作用的指令工厂。

## 示例

```ts
import { createDisposableDirective } from '@base-web-kits/base-tools-vue';

export const vDemo = createDisposableDirective((el) => {
  const onClick = () => console.log(el);

  el.addEventListener('click', onClick);

  return () => {
    el.removeEventListener('click', onClick);
  };
});
```

## 来源

[VueUse](https://vueuse.org/shared/createDisposableDirective/)
