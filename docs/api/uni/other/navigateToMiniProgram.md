# navigateToMiniProgram

打开另一个小程序

## 示例

```ts
import { navigateToMiniProgram } from '@base-web-kits/base-tools-uni';

await navigateToMiniProgram({
  appId: 'wx1234567890',
  path: 'pages/detail/detail?id=123',
  envVersion: 'release',
});
```

## 版本

- 1.0.0 新增
