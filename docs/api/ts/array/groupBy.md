# groupBy

创建一个对象，key 是 `iteratee` 遍历 `collection` 中的每个元素返回的结果。

## 示例

```ts
import { groupBy } from '@base-web-kits/base-tools-ts';

groupBy([6.1, 4.2, 6.3], Math.floor);
// 结果: { '4': [4.2], '6': [6.1, 6.3] }
```

## 参数

- `collection (Array)`: 要迭代的集合。
- `iteratee (Function)`: 每次迭代调用的函数。

## 返回值

- `(Object)`: 返回组成的对象。

## 来源

- [es-toolkit groupBy](https://es-toolkit.dev/zh_hans/reference/array/groupBy.html)
