# loadCss

动态加载 CSS（重复执行不会重复加载，内部已排重）

## 示例

```ts
import { loadCss } from '@base-web-kits/base-tools-web';
await loadCss('https://xx/xx.css');
await loadCss('/a.css', { media: 'print' });
```
