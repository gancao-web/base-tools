# remove

移除数组中 `predicate` 返回真值的所有元素，并返回被移除元素的数组。

## 示例

```ts
import { remove } from '@base-web-kits/base-tools-ts';

const array = [1, 2, 3, 4];
const evens = remove(array, (n) => n % 2 == 0);

console.log(array);
// 结果: [1, 3]

console.log(evens);
// 结果: [2, 4]
```

## 参数

- `array (Array)`: 要修改的数组。
- `predicate (Function)`: 每次迭代调用的函数。

## 返回值

- `(Array)`: 返回被移除元素的数组。

## 来源

- [es-toolkit remove](https://es-toolkit.dev/zh_hans/reference/array/remove.html)
