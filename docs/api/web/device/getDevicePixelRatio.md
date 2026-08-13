# getDevicePixelRatio

获取当前窗口的设备像素比。SSR 环境或浏览器未提供该值时返回 `1`。

## 示例

```ts
import { getDevicePixelRatio } from '@base-web-kits/base-tools-web';

const ratio = getDevicePixelRatio();
```

## 版本

- 1.0.0 新增
