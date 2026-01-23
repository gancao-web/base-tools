# medianBy

根据迭代器函数计算数组的中位数。

## 示例

```ts
import { medianBy } from '@base-web-kits/base-tools-ts';

const objects = [{ 'n': 1 }, { 'n': 2 }, { 'n': 3 }];
medianBy(objects, o => o.n);
// 结果: 2
```

## 参数

- `array (Array)`: 要迭代的数组。
- `iteratee (Function)`: 调用每个元素的迭代函数。

## 返回值

- `(number)`: 返回中位数。

## 来源

- [es-toolkit medianBy](https://es-toolkit.dev/zh_hans/reference/math/medianBy.html)
