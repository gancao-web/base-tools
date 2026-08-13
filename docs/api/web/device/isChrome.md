# isChrome

判断当前网页是否运行在 Chrome 浏览器中。

支持桌面和 iOS Chrome，并排除 Edge、Opera、Samsung Internet 和 Whale 等 Chromium 衍生浏览器。

## 示例

```ts
import { isChrome } from '@base-web-kits/base-tools-web';

if (isChrome()) {
  // Chrome 兼容逻辑
}
```

## 版本

- 1.0.0 新增
