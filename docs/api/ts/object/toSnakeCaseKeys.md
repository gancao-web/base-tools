# toSnakeCaseKeys

将对象的所有 key 转换为下划线命名。

## 示例

```ts
import { toSnakeCaseKeys } from '@base-web-kits/base-tools-ts';

const object = { 'fooBar': 1, 'bazQux': 2 };
toSnakeCaseKeys(object);
// 结果: { 'foo_bar': 1, 'baz_qux': 2 }
```

## 参数

- `object (Object)`: 要转换的对象。

## 返回值

- `(Object)`: 返回转换后的新对象。

## 来源

- [es-toolkit toSnakeCaseKeys](https://es-toolkit.dev/zh_hans/reference/object/toSnakeCaseKeys.html)
