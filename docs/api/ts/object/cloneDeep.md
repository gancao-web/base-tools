# cloneDeep

创建一个深拷贝的对象。

## 示例

```ts
import { cloneDeep } from '@base-web-kits/base-tools-ts';

const objects = [{ a: 1 }, { b: 2 }];
const deep = cloneDeep(objects);
console.log(deep[0] === objects[0]);
// 结果: false
```

## 参数

- `value (any)`: 要拷贝的值。

## 返回值

- `(any)`: 返回深拷贝的对象。

## 来源

- [es-toolkit cloneDeep](https://es-toolkit.dev/zh_hans/reference/object/cloneDeep.html)
