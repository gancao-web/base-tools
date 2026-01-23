# flattenObject

将嵌套对象扁平化为单层对象，key 使用点号连接。

## 示例

```ts
import { flattenObject } from '@base-web-kits/base-tools-ts';

const object = { 'a': { 'b': 2 } };
flattenObject(object);
// 结果: { 'a.b': 2 }
```

## 参数

- `object (Object)`: 要扁平化的对象。

## 返回值

- `(Object)`: 返回扁平化后的对象。

## 来源

- [es-toolkit flattenObject](https://es-toolkit.dev/zh_hans/reference/object/flattenObject.html)
