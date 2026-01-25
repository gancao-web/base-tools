# useElementByPoint

## 描述

响应式的根据坐标获取元素。

## 示例

```ts
import { useElementByPoint } from '@base-web-kits/base-tools-vue';
import { useMouse } from '@base-web-kits/base-tools-vue';

const { x, y } = useMouse();
const { element } = useElementByPoint({ x, y });
```

## 来源

[VueUse](https://vueuse.org/functions/useElementByPoint/)
