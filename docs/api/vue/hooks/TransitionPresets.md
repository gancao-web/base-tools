# TransitionPresets

## 描述

CSS 过渡预设。

## 示例

```ts
import { TransitionPresets, useTransition } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const source = ref(0);
const output = useTransition(source, {
  transition: TransitionPresets.easeInOutCubic,
});
``` 示例代码
```

## 来源

[VueUse](https://vueuse.org/functions/TransitionPresets/)
