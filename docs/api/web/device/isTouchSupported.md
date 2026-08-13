# isTouchSupported

检测当前浏览器环境是否支持触摸输入。SSR 等无 `window` 或 `navigator` 的环境返回 `false`。

## 示例

```ts
import { isTouchSupported } from '@base-web-kits/base-tools-web';

if (isTouchSupported()) {
  // 启用触摸交互
}
```

## 版本

- 1.0.0 新增
