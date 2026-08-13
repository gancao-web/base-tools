# isTablet

判断当前网页是否运行在平板设备上，包含 iPad、Android 平板和带有 `Tablet` 标识的设备。

该结果基于 UA 近似判断。需要区分平台时可使用 `isIPad()` 或 `isAndroidTablet()`。

## 示例

```ts
import { isTablet } from '@base-web-kits/base-tools-web';

if (isTablet()) {
  // 平板设备逻辑
}
```

## 版本

- 1.0.0 新增
