# toCamelCaseKeys

将对象的所有 key 转换为驼峰命名。

## 示例

```ts
import { toCamelCaseKeys } from '@base-web-kits/base-tools-ts';

const object = { 'foo_bar': 1, 'baz-qux': 2 };
toCamelCaseKeys(object);
// 结果: { 'fooBar': 1, 'bazQux': 2 }
```

## 参数

- `object (Object)`: 要转换的对象。

## 返回值

- `(Object)`: 返回转换后的新对象。

## 来源

- [es-toolkit toCamelCaseKeys](https://es-toolkit.dev/zh_hans/reference/object/toCamelCaseKeys.html)
