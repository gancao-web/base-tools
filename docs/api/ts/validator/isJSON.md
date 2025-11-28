# isJSON
判断字符串是否为合法 JSON 文本。

## Example

```ts
import { isJSON } from '@base-web-kits/base-tools/ts';
isJSON('{"a":1}') // true
isJSON('[1,2]') // true
isJSON('abc') // false
```