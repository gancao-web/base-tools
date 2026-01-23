# takeRight

创建一个切片数组，从 `array` 尾部提取 `n` 个元素。

## 示例

```ts
import { takeRight } from '@base-web-kits/base-tools-ts';

takeRight([1, 2, 3]);
// 结果: [3]

takeRight([1, 2, 3], 2);
// 结果: [2, 3]
```

## 参数

- `array (Array)`: 要查询的数组。
- `n (number)`: 要提取的元素个数。

## 返回值

- `(Array)`: 返回数组切片。

## 来源

- [es-toolkit takeRight](https://es-toolkit.dev/zh_hans/reference/array/takeRight.html)
