# hasJs
判断某个 JS 地址是否已在页面中加载过

## Example

```ts
import { hasJs } from '@base-web-kits/base-tools/web';
hasJs('https://xx/xx.js'); // boolean
hasJs('/xx.js'); // boolean
hasJs('xx.js'); // boolean
```