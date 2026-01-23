# isSubset

检查 `object` 是否包含 `source` 的属性值。

## 示例

```ts
import { isSubset } from '@base-web-kits/base-tools-ts';

const object = { 'a': 1, 'b': 2 };
const source = { 'a': 1 };

isSubset(object, source);
// 结果: true
```

## 参数

- `object (Object)`: 要检查的对象。
- `source (Object)`: 属性值来源对象。

## 返回值

- `(boolean)`: 如果 `object` 包含 `source` 的属性值返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit isSubset](https://es-toolkit.dev/zh_hans/reference/predicate/isSubset.html)
