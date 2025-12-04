# bigMinus

高精度减法（支持多个参数连减）。

## 示例

```ts
import { bigMinus } from '@base-web-kits/base-tools-ts';
bigMinus(1, 0.9); // => 0.1
bigMinus('1.1', '0.2'); // => 0.9
bigMinus(10, 1, 2, 3); // => 4  // 多参数连减: 10-1-2-3
```

## 版本

- 1.0.0 新增
