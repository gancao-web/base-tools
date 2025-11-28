# bigCompare
比较两个数值大小。

## Example

```ts
import { bigCompare } from '@base-web-kits/base-tools/ts';
bigCompare('2', '10'); // => -1
bigCompare(3, 3);      // => 0
bigCompare('10', 2);   // => 1
```