# withInjectedProps

注入固定属性 HOC：为组件注入一组固定的 props（外部传入的同名 props 优先级更高）。

## 示例

```tsx
import { withInjectedProps } from '@base-web-kits/base-tools-react';

// 提供默认样式/主题属性
const withPrimary = withInjectedProps({ variant: 'primary', size: 'md' });
export default withPrimary(Button);

// 统一注入埋点/跟踪属性
const withTrack = withInjectedProps({ trackId: 'list' });
export default withTrack(List);
```

## 版本

- 1.0.0 新增
