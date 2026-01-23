# spread

创建一个函数，调用 `func` 时，接受数组参数并将其展开。

## 示例

```ts
import { spread } from '@base-web-kits/base-tools-ts';

const say = spread((who, what) => {
  return who + ' says ' + what;
});

say(['fred', 'hello']);
// 结果: 'fred says hello'
```

## 参数

- `func (Function)`: 要处理的函数。
- `start (number)`: 开始展开的索引。

## 返回值

- `(Function)`: 返回新函数。

## 来源

- [es-toolkit spread](https://es-toolkit.dev/zh_hans/reference/function/spread.html)
