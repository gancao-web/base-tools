# isTaiwanPermit
台湾居民来往大陆通行证（台胞证）号码校验。

## Example

```ts
import { isTaiwanPermit } from '@base-web-kits/base-tools/ts';
isTaiwanPermit('12345678') // true
isTaiwanPermit('T12345678') // true
isTaiwanPermit('1234567890') // true
```