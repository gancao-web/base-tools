# chooseMedia

选择图片和视频，支持拍照和录像

- 微信小程序推荐使用chooseMedia, 而chooseImage或chooseVideo已标记过时
- 不支持H5 (如需在H5上使用, 请使用chooseImage或chooseVideo)

## 示例

```ts
import { chooseMedia } from '@base-web-kits/base-tools-uni';

// 选择图片和视频
const tempFiles = await chooseMedia({ count: 3 });
console.log('tempFiles:', tempFiles);

// 选择图片/拍照
const tempFiles2 = await chooseMedia({ count: 2, mediaType: ['image'] });
console.log('tempFiles2:', tempFiles2);

// 选择视频/录像
const tempFiles3 = await chooseMedia({ count: 1, mediaType: ['video'] });
console.log('tempFiles3:', tempFiles3);
```

## 版本

- 1.0.0 新增
