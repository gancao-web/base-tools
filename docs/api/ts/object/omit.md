# omit

创建一个被忽略属性的对象。

## 示例

```ts
import { omit } from '@base-web-kits/base-tools-ts';

const object = { a: 1, b: '2', c: 3 };

omit(object, ['a', 'c']);
// 结果: { 'b': '2' }
```

## 参数

- `object (Object)`: 来源对象。
- `paths (string[])`: 要忽略的属性路径数组。

## 返回值

- `(Object)`: 返回新对象。

## 来源

- [es-toolkit omit](https://es-toolkit.dev/zh_hans/reference/object/omit.html)
