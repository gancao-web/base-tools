# isAndroidTablet

判断当前网页是否运行在 Android 平板上。

该函数依据 Android 平板 UA 通常包含 `Android`、但不包含 `Mobile` 的约定进行近似判断。

## 示例

```ts
import { isAndroidTablet } from '@base-web-kits/base-tools-web';

if (isAndroidTablet()) {
  // Android 平板兼容逻辑
}
```

## 版本

- 1.5.1 新增
