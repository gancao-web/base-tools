# meanBy

根据迭代器函数计算数组的平均值。

## 示例

```ts
import { meanBy } from '@base-web-kits/base-tools-ts';

const objects = [{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }];
meanBy(objects, (o) => o.n);
// 结果: 5
```

## 参数

- `array (Array)`: 要迭代的数组。
- `iteratee (Function)`: 调用每个元素的迭代函数。

## 返回值

- `(number)`: 返回平均值。

## 来源

- [es-toolkit meanBy](https://es-toolkit.dev/zh_hans/reference/math/meanBy.html)
