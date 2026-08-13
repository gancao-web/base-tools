# isMobile

判断当前网页是否运行在移动设备上，包含手机和平板。

该结果基于 UA 近似判断。响应式布局应优先使用 CSS 媒体查询。

## 示例

```ts
import { isMobile } from '@base-web-kits/base-tools-web';

if (isMobile()) {
  // 移动设备逻辑
}
```

## 版本

- 1.0.0 新增
