# Exact

精确匹配形状（不允许多余属性）。通常用于函数参数校验，确保没有传入多余的属性。

## 示例

```ts
import { Exact } from '@base-web-kits/base-tools-ts';

type Shape = { a: number };

function func<T>(arg: Exact<T, Shape>) {}

func({ a: 1 }); // OK
// func({ a: 1, b: 2 }); // Error
```

## 版本

- 1.0.0 新增