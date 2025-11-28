# toThousandth
数字转千分位字符串（保留小数与符号）。

## Example

```ts
import { toThousandth } from '@base-web-kits/base-tools/ts';
toThousandth(1234567); // => '1,234,567'
toThousandth('1234567.89'); // => '1,234,567.89'
toThousandth('-987654'); // => '-987,654'
```