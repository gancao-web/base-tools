# getLocalStorage
读取 localStorage（自动 JSON 反序列化）

## Example

```ts
import { getLocalStorage } from '@base-web-kits/base-tools/web';

// 读取对象数据
const user = getLocalStorage<{ id: number; name: string }>('user');
console.log(user); // { id: 1, name: 'Alice' } 或 null

// 读取字符串数据
const token = getLocalStorage<string>('token');
console.log(token); // 'abc123' 或 null

// 读取数字数据
const age = getLocalStorage<number>('age');
console.log(age); // 18 或 null

// 读取布尔值数据
const vip = getLocalStorage<boolean>('vip');
console.log(vip); // true 或 null
```