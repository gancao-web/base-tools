# getOS

获取当前网页所在的操作系统，无法识别时返回 `unknown`。

可能的返回值为 `ios`、`android`、`windows`、`chromeos`、`macos`、`linux` 和 `unknown`。iPadOS 归入 `ios`。

## 示例

```ts
import { getOS } from '@base-web-kits/base-tools-web';

const os = getOS();
```

## 版本

- 1.0.0 新增
