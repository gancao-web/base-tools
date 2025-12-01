# isIPRange

校验 CIDR IP 段（支持 IPv4/IPv6），形如 `IP/前缀长度`。

## 示例

```ts
import { isIPRange } from '@base-web-kits/base-tools-ts';
isIPRange('10.0.0.0/8'); // true
isIPRange('2001:db8::/129'); // false
```
