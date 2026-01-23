# pull

移除数组中所有和给定值相等的元素。

## 示例

```ts
import { pull } from '@base-web-kits/base-tools-ts';

const array = ['a', 'b', 'c', 'a', 'b', 'c'];

pull(array, 'a', 'c');
console.log(array);
// 结果: ['b', 'b']
```

## 参数

- `array (Array)`: 要修改的数组。
- `values (...any)`: 要移除的值。

## 返回值

- `(Array)`: 返回 `array`。

## 来源

- [es-toolkit pull](https://es-toolkit.dev/zh_hans/reference/array/pull.html)
