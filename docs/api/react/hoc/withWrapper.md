# withWrapper

包装容器 HOC：使用自定义 `wrapper(children)` 包裹组件渲染。

## 示例

```ts
import { withWrapper } from '@base-web-kits/base-tools-react';
const withTooltip = withWrapper((children) => <Tooltip content="tip">{children}</Tooltip>);
export default withTooltip(Button);
```
