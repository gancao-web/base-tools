# setLocalStorage
写入 localStorage（自动 JSON 序列化）

## Example

```ts
import { setLocalStorage } from '@base-web-kits/base-tools/web';
setLocalStorage('user', { id: 1, name: 'Alice' }); // 对象
setLocalStorage('age', 18); // 数字
setLocalStorage('vip', true); // 布尔值
setLocalStorage('token', 'abc123', 7); // 7 天后过期
```