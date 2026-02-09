# chooseImage

图片的选择或拍摄

- 微信小程序推荐使用chooseMedia, 而chooseImage已标记过时
- 支持h5 (小程序上传取tempFilePaths, 而H5取tempFiles)

## 示例

```ts
import { chooseImage } from '@base-web-kits/base-tools-uni';

// 选择图片和视频
const { tempFilePaths, tempFiles } = await chooseImage({ count: 9 });
console.log('tempFilePaths:', tempFilePaths);
console.log('tempFiles:', tempFiles);
```

## 版本

- 1.2.1 新增
