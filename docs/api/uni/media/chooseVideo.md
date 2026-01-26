# chooseVideo

视频的选择或拍摄

- 支持h5 (小程序上传取tempFilePaths, 而H5取tempFiles)

## 示例

```ts
import { chooseVideo } from '@base-web-kits/base-tools-uni';

// 选择视频或拍摄
const { tempFilePath, tempFile } = await chooseVideo();
console.log('tempFilePath:', tempFilePath);
console.log('tempFile:', tempFile);
```

## 版本

- 1.2.1 新增
