# clone

创建一个浅拷贝的对象。

## 示例

```ts
import { clone } from '@base-web-kits/base-tools-ts';

const objects = [{ a: 1 }, { b: 2 }];
const shallow = clone(objects);
console.log(shallow[0] === objects[0]);
// 结果: true
```

## 参数

- `value (any)`: 要拷贝的值。

## 返回值

- `(any)`: 返回浅拷贝的对象。

## 来源

- [es-toolkit clone](https://es-toolkit.dev/zh_hans/reference/object/clone.html)
