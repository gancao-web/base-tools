# rest

创建一个函数，调用 `func` 时，`startIndex` 之后的所有参数都会被收集到一个数组中。

## 示例

```ts
import { rest } from '@base-web-kits/base-tools-ts';

const say = rest((what, names) => {
  return what + ' ' + names.join(', ');
});

say('hello', 'fred', 'barney', 'pebbles');
// 结果: 'hello fred, barney, pebbles'
```

## 参数

- `func (Function)`: 要处理的函数。
- `start (number)`: 开始收集的索引。

## 返回值

- `(Function)`: 返回新函数。

## 来源

- [es-toolkit rest](https://es-toolkit.dev/zh_hans/reference/function/rest.html)
