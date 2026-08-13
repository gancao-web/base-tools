# getBrowserName

获取浏览器名称，无法识别时返回 `null`。

可能的返回值包括 `chrome`、`edge`、`opera`、`firefox`、`safari`、`ie`、`samsung` 和 `whale`。

## 示例

```ts
import { getBrowserName } from '@base-web-kits/base-tools-web';

const browser = getBrowserName();
```

## 版本

- 1.0.0 新增
