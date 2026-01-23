# dropRight

创建一个切片数组，去除 `array` 尾部的 `n` 个元素。

## 示例

```ts
import { dropRight } from '@base-web-kits/base-tools-ts';

dropRight([1, 2, 3]);
// 结果: [1, 2]

dropRight([1, 2, 3], 2);
// 结果: [1]
```

## 参数

- `array (Array)`: 要查询的数组。
- `n (number)`: 要去除的元素个数。

## 返回值

- `(Array)`: 返回数组切片。

## 来源

- [es-toolkit dropRight](https://es-toolkit.dev/zh_hans/reference/array/dropRight.html)
