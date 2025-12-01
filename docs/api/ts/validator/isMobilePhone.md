# isMobilePhone

是否为中国大陆手机号（11 位，以 1 开头，第二位 3-9）。

## 示例

```ts
import { isMobilePhone } from '@base-web-kits/base-tools-ts';
isMobilePhone('13800138000'); // true
isMobilePhone('12800138000'); // false
```
