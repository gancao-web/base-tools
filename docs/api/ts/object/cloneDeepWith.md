# cloneDeepWith

类似 `cloneDeep`，但是接受一个 `customizer` 自定义拷贝行为。

## 示例

```ts
import { cloneDeepWith } from '@base-web-kits/base-tools-ts';

function customizer(value) {
  if (typeof value === 'number') {
    return value * 2;
  }
}

const objects = [{ 'a': 1 }, { 'b': 2 }];
const deep = cloneDeepWith(objects, customizer);
// 结果: [{ 'a': 2 }, { 'b': 4 }]
```

## 参数

- `value (any)`: 要拷贝的值。
- `customizer (Function)`: 自定义拷贝函数。

## 返回值

- `(any)`: 返回深拷贝的对象。

## 来源

- [es-toolkit cloneDeepWith](https://es-toolkit.dev/zh_hans/reference/object/cloneDeepWith.html)
