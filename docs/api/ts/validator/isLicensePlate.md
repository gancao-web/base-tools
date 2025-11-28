# isLicensePlate
中国车牌号校验（含普通与新能源）。

## Example

```ts
import { isLicensePlate } from '@base-web-kits/base-tools/ts';
isLicensePlate('京A12345') // true
isLicensePlate('沪A12345D') // 新能源（末位 D/F）
isLicensePlate('粤BDF12345') // 新能源（第三位 D/F）
```