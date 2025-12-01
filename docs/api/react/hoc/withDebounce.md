# withDebounce

防抖 props HOC：在 props 频繁变化时，延迟传递到内部组件，降低渲染频率。

## 示例

```ts
import { withDebounce } from '@base-web-kits/base-tools-react';
// 输入联动场景：防抖减少渲染
const DebouncedSearch = withDebounce(300)(SearchBox);

// 仅首次立即更新，后续走 trailing
const DebouncedList = withDebounce(500, { leading: true })(List);
```
