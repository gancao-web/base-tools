# useShare

## 描述

响应式的 Web Share API。

## 示例

```ts
import { useShare } from '@base-web-kits/base-tools-vue';

const { share, isSupported } = useShare();

share({
  title: 'Hello',
  text: 'Hello my friend!',
  url: location.href,
});
```

## 来源

[VueUse](https://vueuse.org/functions/useShare/)
