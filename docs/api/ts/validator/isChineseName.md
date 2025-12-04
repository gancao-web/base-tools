# isChineseName

中文姓名（允许中间点 `·`），长度 2-20。

## 示例

```ts
import { isChineseName } from '@base-web-kits/base-tools-ts';
isChineseName('张三'); // true
isChineseName('阿·娜'); // true
```

## 版本

- 1.0.0 新增
