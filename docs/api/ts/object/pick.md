# pick

创建一个选中属性的对象。

## 示例

```ts
import { pick } from '@base-web-kits/base-tools-ts';

const object = { a: 1, b: '2', c: 3 };

pick(object, ['a', 'c']);
// 结果: { 'a': 1, 'c': 3 }
```

## 参数

- `object (Object)`: 来源对象。
- `paths (string[])`: 要选中的属性路径数组。

## 返回值

- `(Object)`: 返回新对象。

## 来源

- [es-toolkit pick](https://es-toolkit.dev/zh_hans/reference/object/pick.html)
