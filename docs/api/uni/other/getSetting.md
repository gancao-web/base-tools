# getSetting

获取用户的当前设置，包括授权信息

## 示例

```ts
import { getSetting } from '@base-web-kits/base-tools-uni';

const setting = await getSetting();
console.log(setting.authSetting);
console.log(setting.subscriptionsSetting);
```
