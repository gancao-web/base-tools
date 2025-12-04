# withSkeleton

骨架屏 HOC：当 `props[prop]` 为真时展示 `skeleton`，否则渲染组件。常用于页面/列表初次加载的占位。

## 示例

```tsx
import { withSkeleton } from '@base-web-kits/base-tools-react';

// 页面骨架
export default withSkeleton(<PageSkeleton />)(Page);

// 列表骨架：服务端数据加载中
export default withSkeleton(<ListSkeleton />, 'loading')(List);

// ready 为真时渲染，未就绪显示骨架
export default withSkeleton(<ProfileSkeleton />, 'ready', true)(Profile);
```

## 版本

- 1.0.0 新增
