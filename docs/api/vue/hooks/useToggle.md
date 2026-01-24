# useToggle

## 描述

用于切换布尔值的 Hook。

## 示例

```ts
import { useToggle } from '@base-web-kits/base-tools-vue';

const [value, toggle] = useToggle(); // value 默认为 false

toggle(); // value 变为 true
toggle(false); // value 变为 false
```

## 来源

[VueUse](https://vueuse.org/functions/useToggle/)
