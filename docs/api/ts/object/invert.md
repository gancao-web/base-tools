# invert

创建一个 key-value 翻转的对象。

## 示例

```ts
import { invert } from '@base-web-kits/base-tools-ts';

const object = { a: 1, b: 2, c: 1 };
invert(object);
// 结果: { '1': 'c', '2': 'b' }
```

## 参数

- `object (Object)`: 要翻转的对象。

## 返回值

- `(Object)`: 返回新对象。

## 来源

- [es-toolkit invert](https://es-toolkit.dev/zh_hans/reference/object/invert.html)
