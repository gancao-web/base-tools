# countBy

创建一个对象，key 是 `iteratee` 遍历 `collection` 中的每个元素返回的结果，value 是该结果出现的次数。

## 示例

```ts
import { countBy } from '@base-web-kits/base-tools-ts';

countBy([6.1, 4.2, 6.3], Math.floor);
// 结果: { '4': 1, '6': 2 }
```

## 参数

- `collection (Array)`: 要迭代的集合。
- `iteratee (Function)`: 每次迭代调用的函数。

## 返回值

- `(Object)`: 返回组成的对象。

## 来源

- [es-toolkit countBy](https://es-toolkit.dev/zh_hans/reference/array/countBy.html)
