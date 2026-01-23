# zipObject

这个方法类似 `zip`，但是返回一个对象。

## 示例

```ts
import { zipObject } from '@base-web-kits/base-tools-ts';

zipObject(['a', 'b'], [1, 2]);
// 结果: { 'a': 1, 'b': 2 }
```

## 参数

- `props (Array)`: 属性名数组。
- `values (Array)`: 属性值数组。

## 返回值

- `(Object)`: 返回新对象。

## 来源

- [es-toolkit zipObject](https://es-toolkit.dev/zh_hans/reference/array/zipObject.html)
