# zip

创建一个打包元素的新数组。

## 示例

```ts
import { zip } from '@base-web-kits/base-tools-ts';

zip(['a', 'b'], [1, 2], [true, false]);
// 结果: [['a', 1, true], ['b', 2, false]]
```

## 参数

- `arrays (...Array)`: 要处理的数组。

## 返回值

- `(Array)`: 返回打包后的新数组。

## 来源

- [es-toolkit zip](https://es-toolkit.dev/zh_hans/reference/array/zip.html)
