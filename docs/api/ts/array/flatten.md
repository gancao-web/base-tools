# flatten

将数组扁平化一级。

## 示例

```ts
import { flatten } from '@base-web-kits/base-tools-ts';

flatten([1, [2, [3, [4]], 5]]);
// 结果: [1, 2, [3, [4]], 5]
```

## 参数

- `array (Array)`: 要扁平化的数组。

## 返回值

- `(Array)`: 返回扁平化后的新数组。

## 来源

- [es-toolkit flatten](https://es-toolkit.dev/zh_hans/reference/array/flatten.html)
