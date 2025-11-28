# isLetter
纯字母（不含空格与符号）。

## Example

```ts
import { isLetter } from '@base-web-kits/base-tools/ts';
isLetter('abc') // true
isLetter('123') // false
isLetter('abc123') // false
```