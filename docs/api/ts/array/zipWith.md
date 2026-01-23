# zipWith

类似 `zip`，但是接受一个 `iteratee` 指定重组方式。

## 示例

```ts
import { zipWith } from '@base-web-kits/base-tools-ts';

zipWith([1, 2], [10, 20], [100, 200], (a, b, c) => a + b + c);
// 结果: [111, 222]
```

## 参数

- `arrays (...Array)`: 要处理的数组。
- `iteratee (Function)`: 指定重组方式的函数。

## 返回值

- `(Array)`: 返回打包后的新数组。

## 来源

- [es-toolkit zipWith](https://es-toolkit.dev/zh_hans/reference/array/zipWith.html)
