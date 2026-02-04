# unzipWith

类似 `unzip`，但是接受一个 `iteratee` 指定重组方式。

## 示例

```ts
import { unzipWith } from '@base-web-kits/base-tools-ts';

const zipped = [
  [1, 10, 100],
  [2, 20, 200],
];
unzipWith(zipped, (a, b) => a + b);
// 结果: [3, 30, 300]
```

## 参数

- `array (Array)`: 要分组的数组。
- `iteratee (Function)`: 指定重组方式的函数。

## 返回值

- `(Array)`: 返回重组后的数组。

## 来源

- [es-toolkit unzipWith](https://es-toolkit.dev/zh_hans/reference/array/unzipWith.html)
