# merge

递归合并来源对象的属性到目标对象。

## 示例

```ts
import { merge } from '@base-web-kits/base-tools-ts';

const object = {
  a: [{ b: 2 }, { d: 4 }],
};

const other = {
  a: [{ c: 3 }, { e: 5 }],
};

merge(object, other);
// 结果: { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
```

## 参数

- `object (Object)`: 目标对象。
- `sources (...Object)`: 来源对象。

## 返回值

- `(Object)`: 返回 `object`。

## 来源

- [es-toolkit merge](https://es-toolkit.dev/zh_hans/reference/object/merge.html)
