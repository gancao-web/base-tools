# sumBy

根据迭代器函数计算数组的总和。

## 示例

```ts
import { sumBy } from '@base-web-kits/base-tools-ts';

const objects = [{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }];
sumBy(objects, (o) => o.n);
// 结果: 20
```

## 参数

- `array (Array)`: 要迭代的数组。
- `iteratee (Function)`: 调用每个元素的迭代函数。

## 返回值

- `(number)`: 返回总和。

## 来源

- [es-toolkit sumBy](https://es-toolkit.dev/zh_hans/reference/math/sumBy.html)
