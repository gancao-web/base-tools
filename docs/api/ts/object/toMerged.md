# toMerged

创建一个合并了来源对象属性的新对象。

## 示例

```ts
import { toMerged } from '@base-web-kits/base-tools-ts';

const object = { 'a': 1 };
const other = { 'b': 2 };

toMerged(object, other);
// 结果: { 'a': 1, 'b': 2 }
```

## 参数

- `object (Object)`: 目标对象。
- `source (Object)`: 来源对象。

## 返回值

- `(Object)`: 返回新对象。

## 来源

- [es-toolkit toMerged](https://es-toolkit.dev/zh_hans/reference/object/toMerged.html)
