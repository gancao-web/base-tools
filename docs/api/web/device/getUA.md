# getUA

获取转换为小写的用户代理字符串（UA）。SSR 等无 `navigator` 的环境返回空字符串。

## 示例

```ts
import { getUA } from '@base-web-kits/base-tools-web';

const ua = getUA();
```

## 版本

- 1.0.0 新增
