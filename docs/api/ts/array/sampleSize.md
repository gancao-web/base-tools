# sampleSize

从数组中获取 n 个随机元素。

## 示例

```ts
import { sampleSize } from '@base-web-kits/base-tools-ts';

sampleSize([1, 2, 3], 2);
// 结果: [3, 1] (随机)
```

## 参数

- `collection (Array)`: 要取样的集合。
- `n (number)`: 要取样的个数。

## 返回值

- `(Array)`: 返回随机元素数组。

## 来源

- [es-toolkit sampleSize](https://es-toolkit.dev/zh_hans/reference/array/sampleSize.html)
