# differenceWith

类似 `difference`，但是接受一个 `comparator` 比较每个元素。

## 示例

```ts
import { differenceWith } from '@base-web-kits/base-tools-ts';

const objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
differenceWith(objects, [{ 'x': 1, 'y': 2 }], isEqual);
// 结果: [{ 'x': 2, 'y': 1 }]
```

## 参数

- `array (Array)`: 要检查的数组。
- `values (Array)`: 要排除的值的数组。
- `comparator (Function)`: 比较每个元素的函数。

## 返回值

- `(Array)`: 过滤后的新数组。

## 来源

- [es-toolkit differenceWith](https://es-toolkit.dev/zh_hans/reference/array/differenceWith.html)
