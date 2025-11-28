# isMobile
是否为移动端设备（含平板）

## Example

```ts
import { isMobile } from '@base-web-kits/base-tools/web';

// 基础用法
if (isMobile()) {
  console.log('当前是移动端设备');
  // 移动端特定逻辑
}

// 响应式布局判断
const isMobileDevice = isMobile();
const layout = isMobileDevice ? 'mobile' : 'desktop';
```