# useScriptTag

## 描述

注入 script 标签。

## 示例

```ts
import { useScriptTag } from '@base-web-kits/base-tools-vue';

useScriptTag(
  'https://player.twitch.tv/js/embed/v1.js',
  // onLoaded
  (el: HTMLScriptElement) => {
    // do something
  },
);
```

## 来源

[VueUse](https://vueuse.org/functions/useScriptTag/)
