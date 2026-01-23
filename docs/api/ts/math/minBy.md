# minBy

计算数组中的最小值。如果数组为空或假值，则返回 undefined。

## 示例

```ts
import { minBy } from '@base-web-kits/base-tools-ts';

const objects = [{ 'n': 1 }, { 'n': 2 }];
minBy(objects, o => o.n);
// 结果: { 'n': 1 }
```

## 参数

- `array (Array)`: 要迭代的数组。
- `iteratee (Function)`: 调用每个元素的迭代函数。

## 返回值

- `(T | undefined)`: 返回最小值元素。

## 来源

- [es-toolkit minBy](https://es-toolkit.dev/zh_hans/reference/math/minBy.html)
