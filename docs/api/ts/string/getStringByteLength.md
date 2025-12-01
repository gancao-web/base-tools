# getStringByteLength

计算字符串在 UTF-8 编码下的字节长度。

## 示例

```ts
import { getStringByteLength } from '@base-web-kits/base-tools-ts';
getStringByteLength('abc'); // 3
getStringByteLength('中文'); // 6
getStringByteLength('😊'); // 4
```
