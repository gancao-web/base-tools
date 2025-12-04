# withMemo

使用 `React.memo` 包裹组件以避免不必要的渲染。可选传入自定义 props 比较函数。

## 示例

```tsx
import { withMemo } from '@base-web-kits/base-tools-react';

// 基础用法：提升列表渲染性能
const UserListMemo = withMemo(UserList);

// 自定义比较：忽略非关心的属性变化
const CardMemo = withMemo(Card, (prev, next) => prev.title === next.title);
export default CardMemo;
```

## 版本

- 1.0.0 新增
