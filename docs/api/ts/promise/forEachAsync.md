# forEachAsync

异步遍历数组元素。

## 示例

```ts
import { forEachAsync } from '@base-web-kits/base-tools-ts';

const array = [1, 2, 3];
await forEachAsync(array, async (n) => {
  console.log(n);
});
```

## 参数

- `collection (Array)`: 要迭代的集合。
- `iteratee (Function)`: 异步迭代函数。

## 返回值

- `(Promise<void>)`: 不返回任何内容。

## 来源

- [es-toolkit forEachAsync](https://es-toolkit.dev/zh_hans/reference/promise/forEachAsync.html)
