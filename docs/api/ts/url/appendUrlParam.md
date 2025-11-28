# appendUrlParam
将对象参数拼接到 URL

## Example

```ts
import { appendUrlParam } from '@base-web-kits/base-tools/ts';
const url = appendUrlParam('https://a.com', { q: '测试', list: [1, 2], a: null, b: undefined }); // 'https://a.com/?q=%E6%B5%8B%E8%AF%95&list=[1,2]'
```