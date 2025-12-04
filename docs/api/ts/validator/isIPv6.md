# isIPv6

判断是否为合法 IPv6 地址（支持压缩表示与 IPv4 映射）。

## 示例

```ts
import { isIPv6 } from '@base-web-kits/base-tools-ts';
isIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334'); // true
isIPv6('2001:db8::8a2e:370:7334'); // true
isIPv6('2001:::370:7334'); // false
```

## 版本

- 1.0.0 新增
