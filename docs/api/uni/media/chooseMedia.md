# chooseMedia

选择图片和视频，支持拍照和录像

- 微信小程序推荐使用chooseMedia, 而chooseImage或chooseVideo已标记过时
- H5会根据mediaType自动使用chooseImage或chooseVideo
- H5不支持同时选择图片和视频, mediaType为混选或未指定时默认选择图片
- H5选择视频时只能选择一个文件, count不生效
- 返回统一的媒体文件数组, H5结果额外包含上传所需的file字段

## 示例

```ts
import { chooseMedia } from '@base-web-kits/base-tools-uni';

// 选择图片和视频（H5默认选择图片）
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

- 1.4.13 支持H5选择单一类型的图片或视频
- 1.0.0 新增
