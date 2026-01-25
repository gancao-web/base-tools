# useBreakpoints

## 描述

响应式的视口断点。

## 示例

```ts
import { useBreakpoints, breakpointsTailwind } from '@base-web-kits/base-tools-vue';

const breakpoints = useBreakpoints(breakpointsTailwind);
const sm = breakpoints.smaller('sm');
const md = breakpoints.between('sm', 'md');
const lg = breakpoints.greater('lg');
```

## 来源

[VueUse](https://vueuse.org/functions/useBreakpoints/)
