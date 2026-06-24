# useCssSupports

## 描述

响应式检测当前环境是否支持指定的 CSS 属性值或 `@supports` 条件。

## 示例

```ts
import { useCssSupports } from '@base-web-kits/base-tools-vue';

const supportsGrid = useCssSupports('display', 'grid');
const supportsBackdrop = useCssSupports('(backdrop-filter: blur(4px))');
```

## 来源

[VueUse](https://vueuse.org/core/useCssSupports/)
