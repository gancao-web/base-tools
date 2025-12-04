# isEmail

校验邮箱地址（基于 RFC 5322 的常用子集）。

## 示例

```ts
import { isEmail } from '@base-web-kits/base-tools-ts';
isEmail('user@example.com'); // true
isEmail('invalid@'); // false
```

## 版本

- 1.0.0 新增
