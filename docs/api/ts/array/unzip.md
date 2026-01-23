# unzip

类似 `zip` 的逆操作。

## 示例

```ts
import { unzip } from '@base-web-kits/base-tools-ts';

const zipped = [['a', 1, true], ['b', 2, false]];
unzip(zipped);
// 结果: [['a', 'b'], [1, 2], [true, false]]
```

## 参数

- `array (Array)`: 要分组的数组。

## 返回值

- `(Array)`: 返回重组后的数组。

## 来源

- [es-toolkit unzip](https://es-toolkit.dev/zh_hans/reference/array/unzip.html)
