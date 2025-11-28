# isChineseName
中文姓名（允许中间点 `·`），长度 2-20。

## Example

```ts
import { isChineseName } from '@base-web-kits/base-tools/ts';
isChineseName('张三') // true
isChineseName('阿·娜') // true
```