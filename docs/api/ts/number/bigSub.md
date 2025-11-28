# bigSub
高精度减法（支持多个参数连减）。

## Example

```ts
import { bigSub } from '@base-web-kits/base-tools/ts';
bigSub(1, 0.9); // => 0.1
bigSub('1.1', '0.2'); // => 0.9
bigSub(10, 1, 2, 3); // => 4  // 多参数连减: 10-1-2-3
```