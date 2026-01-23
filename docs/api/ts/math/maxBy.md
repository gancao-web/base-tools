# maxBy

计算数组中的最大值。如果数组为空或假值，则返回 undefined。

## 示例

```ts
import { maxBy } from '@base-web-kits/base-tools-ts';

const objects = [{ 'n': 1 }, { 'n': 2 }];
maxBy(objects, o => o.n);
// 结果: { 'n': 2 }
```

## 参数

- `array (Array)`: 要迭代的数组。
- `iteratee (Function)`: 调用每个元素的迭代函数。

## 返回值

- `(T | undefined)`: 返回最大值元素。

## 来源

- [es-toolkit maxBy](https://es-toolkit.dev/zh_hans/reference/math/maxBy.html)
