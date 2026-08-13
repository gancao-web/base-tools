# isPC

判断当前网页是否运行在非手机、非平板设备上。SSR 或 UA 为空时返回 `false`。

## 示例

```ts
import { isPC } from '@base-web-kits/base-tools-web';

if (isPC()) {
  // 桌面设备逻辑
}
```

## 版本

- 1.0.0 新增
