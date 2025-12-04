# chooseMedia

选择图片和视频，支持拍照和录像

## 示例

```ts
import { chooseMedia } from '@base-web-kits/base-tools-uni';

const tempFiles = await chooseMedia({ count: 3 });
console.log('tempFiles:', tempFiles);
```

## 版本

- 1.0.0 新增
