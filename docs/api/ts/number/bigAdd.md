# bigAdd
高精度加法（支持多个参数连加）。

## Example

```ts
import { bigAdd } from '@base-web-kits/base-tools/ts';
bigAdd(0.1, 0.2); // => 0.3
bigAdd('0.1', '0.2'); // => 0.3
bigAdd(1, 2, 3, 4); // => 10  // 多参数连加: 1+2+3+4
```