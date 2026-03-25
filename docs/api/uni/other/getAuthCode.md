# getAuthCode

获取登录凭证（uni.login 的 code），用于后续换取用户登录态信息

## 示例

```ts
import { getAuthCode } from '@base-web-kits/base-tools-uni';

const { code } = await getAuthCode();
console.log('登录凭证:', code);
```

## 版本

- 1.3.11 新增
