# mergeWith

类似 `merge`，但是接受一个 `customizer` 决定如何合并。

## 示例

```ts
import { mergeWith } from '@base-web-kits/base-tools-ts';

function customizer(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

const object = { a: [1], b: [2] };
const other = { a: [3], b: [4] };

mergeWith(object, other, customizer);
// 结果: { 'a': [1, 3], 'b': [2, 4] }
```

## 参数

- `object (Object)`: 目标对象。
- `sources (...Object)`: 来源对象。
- `customizer (Function)`: 自定义合并函数。

## 返回值

- `(Object)`: 返回 `object`。

## 来源

- [es-toolkit mergeWith](https://es-toolkit.dev/zh_hans/reference/object/mergeWith.html)
