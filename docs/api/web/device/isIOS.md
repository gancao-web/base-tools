# isIOS

判断当前网页是否运行在 iPhone、iPad 或 iPod touch 上。

包含使用桌面模式 UA 的 iPadOS，不包含 macOS。

## 示例

```ts
import { isIOS } from '@base-web-kits/base-tools-web';

if (isIOS()) {
  // iOS 或 iPadOS 兼容逻辑
}
```

## 版本

- 1.0.0 新增
