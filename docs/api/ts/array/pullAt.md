# pullAt

根据索引移除数组中的元素。

## 示例

```ts
import { pullAt } from '@base-web-kits/base-tools-ts';

const array = ['a', 'b', 'c', 'd'];
const pulled = pullAt(array, [1, 3]);

console.log(array);
// 结果: ['a', 'c']

console.log(pulled);
// 结果: ['b', 'd']
```

## 参数

- `array (Array)`: 要修改的数组。
- `indexes (number[] | number)`: 要移除元素的索引。

## 返回值

- `(Array)`: 返回被移除元素的数组。

## 来源

- [es-toolkit pullAt](https://es-toolkit.dev/zh_hans/reference/array/pullAt.html)
