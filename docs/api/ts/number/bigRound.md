# bigRound
四舍五入到指定位数

## Example

```ts
import { bigRound } from '@base-web-kits/base-tools/ts';
bigRound(1.6); // => 2
bigRound('1.234', 2); // => 1.23
bigRound('1.235', 2); // => 1.24
bigRound('1.299', 2, BigNumber.ROUND_DOWN); // => 1.29
```