# downloadFile

下载文件到本地临时路径

## 示例

```ts
import { downloadFile } from '@base-web-kits/base-tools-uni';

const tempPath = await downloadFile('/files/document.pdf');
```

## 参数

- `path: string` - 文件地址，支持网络地址和相对路径（会自动拼接hostFile配置）
- `option?: object` - 可选配置项：
  - `cacheFile: boolean` - 是否启用缓存，相同地址的文件优先使用已下载的缓存，默认为 `true`
  - `showLoading: string` - 下载时显示的加载提示文本
  - `toastSuccess: string` - 下载成功时的提示文本
  - `toastError: string` - 下载失败时的提示文本
